import * as vscode from 'vscode';
import { TaskStore } from '../core/store';
import { Task, TaskHistory } from '../core/types';
import { getJiraClient } from './credentials';
import { CommitRef, findCommitsByIssueId, getRemoteUrl } from './git';
import type { JiraClient } from './client';

const PUSHABLE_STATUSES = new Set(['in_review', 'completed']);

export async function pushSelectedToJira(context: vscode.ExtensionContext, store: TaskStore): Promise<void> {
    if (!vscode.workspace.workspaceFolders) {
        vscode.window.showErrorMessage('Open a workspace folder first.');
        return;
    }

    let client;
    try {
        client = await getJiraClient(context);
    } catch (e: any) {
        vscode.window.showErrorMessage(e.message);
        return;
    }

    const candidates = store.getAllTasks().filter(
        t => typeof t.issue === 'string' && t.issue.trim().length > 0 && PUSHABLE_STATUSES.has(t.status)
    );

    if (candidates.length === 0) {
        vscode.window.showInformationMessage(
            'No pushable issues. Mark a task as in_review or completed first.'
        );
        return;
    }

    const picks = await vscode.window.showQuickPick(
        candidates.map(t => ({
            label: `[${t.issue}] ${t.title}`,
            description: t.status,
            detail: `${t._project ?? ''}/${t._module ?? ''}`,
            task: t,
            picked: false,
        })),
        { canPickMany: true, placeHolder: 'Select issues to push to Jira' }
    );
    if (!picks || picks.length === 0) { return; }

    const cfg = vscode.workspace.getConfiguration('pog.taskManager.jira');
    const inReviewTransition = cfg.get<string>('inReviewTransitionName', 'In Review');
    const doneTransition = cfg.get<string>('doneTransitionName', 'Done');

    const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    const remoteUrl = await getRemoteUrl(rootPath);

    await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title: 'Pog Jira: pushing...' },
        async () => {
            let pushed = 0;
            const errors: string[] = [];

            for (const pick of picks) {
                const task = pick.task;
                const issueKey = (task.issue || '').trim();
                const transitionName = task.status === 'completed' ? doneTransition : inReviewTransition;

                try {
                    const commentError = await pushOneTask(
                        client!, store, task, transitionName, rootPath, remoteUrl
                    );
                    if (commentError) {
                        errors.push(`${issueKey}: transitioned but comment failed — ${commentError}`);
                    } else {
                        pushed++;
                    }
                } catch (e: any) {
                    errors.push(`${issueKey}: ${e.message}`);
                }
            }

            await store.load();

            const summary = `Pog Jira: ${pushed} pushed${errors.length ? `, ${errors.length} failed` : ''}.`;
            if (errors.length > 0) {
                vscode.window.showWarningMessage(`${summary} ${errors.join(' | ')}`);
            } else {
                vscode.window.showInformationMessage(summary);
            }
        }
    );
}

export async function pushIssueTask(context: vscode.ExtensionContext, store: TaskStore, task: Task): Promise<void> {
    if (!vscode.workspace.workspaceFolders) {
        vscode.window.showErrorMessage('Open a workspace folder first.');
        return;
    }

    const issueKey = (task.issue || '').trim();
    if (!issueKey) {
        vscode.window.showErrorMessage('This task has no Jira issue key.');
        return;
    }
    if (!PUSHABLE_STATUSES.has(task.status)) {
        const ok = await vscode.window.showWarningMessage(
            `Task status is "${task.status}". Push will mark it as in_review on Jira. Continue?`,
            { modal: true },
            'Push anyway'
        );
        if (ok !== 'Push anyway') { return; }
    }

    let client;
    try {
        client = await getJiraClient(context);
    } catch (e: any) {
        vscode.window.showErrorMessage(e.message);
        return;
    }

    const cfg = vscode.workspace.getConfiguration('pog.taskManager.jira');
    const inReviewTransition = cfg.get<string>('inReviewTransitionName', 'In Review');
    const doneTransition = cfg.get<string>('doneTransitionName', 'Done');
    const transitionName = task.status === 'completed' ? doneTransition : inReviewTransition;

    const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    const remoteUrl = await getRemoteUrl(rootPath);

    await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title: `Pog Jira: pushing ${issueKey}...` },
        async () => {
            try {
                const commentError = await pushOneTask(client!, store, task, transitionName, rootPath, remoteUrl);
                await store.load();
                if (commentError) {
                    vscode.window.showWarningMessage(
                        `Pog Jira: ${issueKey} transitioned but comment failed — ${commentError}`
                    );
                } else {
                    vscode.window.showInformationMessage(`Pog Jira: pushed ${issueKey}.`);
                }
            } catch (e: any) {
                vscode.window.showErrorMessage(`Pog Jira: ${issueKey}: ${e.message}`);
            }
        }
    );
}

async function pushOneTask(
    client: JiraClient,
    store: TaskStore,
    task: Task,
    transitionName: string,
    rootPath: string,
    remoteUrl: string | undefined
): Promise<string | undefined> {
    const issueKey = (task.issue || '').trim();
    const commits = await findCommitsByIssueId(rootPath, issueKey, remoteUrl);

    await client.transitionIssue(issueKey, transitionName);

    let commentError: string | undefined;
    try {
        await client.addComment(issueKey, renderComment(task, commits));
    } catch (e: any) {
        commentError = e.message;
    }

    await appendPushedHistory(store, task, transitionName, commits.length, commentError);
    return commentError;
}

function renderComment(task: Task, commits: CommitRef[]): string {
    const lines: string[] = [];
    lines.push(`*Pog update: ${task.status}*`);
    lines.push(`Title: ${task.title}`);

    if (task.notes && task.notes.trim().length > 0) {
        lines.push('', '*Notes:*', task.notes.trim());
    }

    const lastHistory = task.history && task.history.length > 0
        ? task.history[task.history.length - 1]
        : undefined;
    if (lastHistory) {
        lines.push(
            '',
            '*Last activity:*',
            `${lastHistory.timestamp} [${lastHistory.agent}] ${lastHistory.action}: ${lastHistory.message}`
        );
    }

    if (commits.length > 0) {
        lines.push('', `*Commits (${commits.length}):*`);
        for (const c of commits) {
            const short = c.sha.slice(0, 8);
            lines.push(c.url ? `- [${short}|${c.url}] ${c.message}` : `- ${short} ${c.message}`);
        }
    }

    return lines.join('\n');
}

async function appendPushedHistory(
    store: TaskStore,
    task: Task,
    transitionName: string,
    commitCount: number,
    commentError?: string
): Promise<void> {
    const entry: TaskHistory = {
        timestamp: new Date().toISOString(),
        agent: 'pog-task-manager',
        action: 'progress',
        message: commentError
            ? `Pushed to Jira (transition=${transitionName}, commits=${commitCount}); comment failed: ${commentError}`
            : `Pushed to Jira (transition=${transitionName}, commits=${commitCount})`,
    };
    const history = [...(task.history || []), entry];
    await store.saveTask(task, { history });
}
