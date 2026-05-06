import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { TaskStore } from '../core/store';
import { Task } from '../core/types';
import { getJiraClient } from './credentials';
import { JiraIssue } from './client';

export async function pullFromJira(context: vscode.ExtensionContext, store: TaskStore): Promise<void> {
    if (!vscode.workspace.workspaceFolders) {
        vscode.window.showErrorMessage('Open a workspace folder first.');
        return;
    }

    const cfg = vscode.workspace.getConfiguration('pog.taskManager.jira');
    const defaultJql = cfg.get<string>('defaultJql', 'assignee=currentUser() AND status="To Do"');
    const pullProject = cfg.get<string>('pullProject', 'jira');
    const pullModule = cfg.get<string>('pullModule', 'inbox');

    const jql = await vscode.window.showInputBox({
        prompt: 'JQL',
        value: defaultJql,
        ignoreFocusOut: true,
    });
    if (!jql) { return; }

    if (jql !== defaultJql) {
        const target = vscode.workspace.workspaceFolders
            ? vscode.ConfigurationTarget.Workspace
            : vscode.ConfigurationTarget.Global;
        try {
            await cfg.update('defaultJql', jql, target);
        } catch (e: any) {
            console.warn('[pog-task] failed to persist defaultJql:', e?.message ?? e);
        }
    }

    let client;
    try {
        client = await getJiraClient(context);
    } catch (e: any) {
        vscode.window.showErrorMessage(e.message);
        return;
    }

    const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    const targetDir = path.join(rootPath, 'pog-task', 'list', pullProject, pullModule);

    await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title: 'Pog Jira: pulling...' },
        async () => {
            let issues: JiraIssue[];
            try {
                issues = await client!.searchIssues(jql);
            } catch (e: any) {
                vscode.window.showErrorMessage(`Jira search failed: ${e.message}`);
                return;
            }

            if (issues.length === 0) {
                vscode.window.showInformationMessage('Pog Jira: JQL matched no issues.');
                return;
            }

            const existingByIssueKey = new Set(
                store.getAllTasks()
                    .map(t => (t.issue || '').trim())
                    .filter(k => k.length > 0)
            );

            fs.mkdirSync(targetDir, { recursive: true });

            let created = 0;
            let skipped = 0;
            const errors: string[] = [];

            for (const issue of issues) {
                if (existingByIssueKey.has(issue.key)) {
                    skipped++;
                    continue;
                }
                const filename = buildFilename(issue);
                const filePath = path.join(targetDir, filename);
                if (fs.existsSync(filePath)) {
                    skipped++;
                    continue;
                }
                try {
                    const task = buildTaskFromIssue(issue, jql);
                    await store.createTask(task, filePath);
                    created++;
                } catch (e: any) {
                    errors.push(`${issue.key}: ${e.message}`);
                }
            }

            await store.load();

            const summary = `Pog Jira: ${created} created, ${skipped} skipped${errors.length ? `, ${errors.length} failed` : ''}.`;
            if (errors.length > 0) {
                vscode.window.showWarningMessage(`${summary} ${errors.join(' | ')}`);
            } else {
                vscode.window.showInformationMessage(summary);
            }
        }
    );
}

function buildFilename(issue: JiraIssue): string {
    const safeSummary = issue.summary
        .replace(/[^a-z0-9一-龥]+/gi, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 60) || 'issue';
    return `${issue.key} - ${safeSummary}.yaml`;
}

function buildTaskFromIssue(issue: JiraIssue, jql: string): Task {
    const now = new Date().toISOString();
    const description = (issue.description || '').trim();
    return {
        type: 'task',
        id: crypto.randomUUID(),
        title: issue.summary || issue.key,
        description,
        category: 'feature',
        priority: 'medium',
        status: 'pending',
        created_at: now,
        issue: issue.key,
        tags: ['jira'],
        original_prompt: description
            ? `Pulled from Jira issue ${issue.key} (status="${issue.status}"):\n\n${description}`
            : `Pulled from Jira issue ${issue.key} (status="${issue.status}").`,
        history: [{
            timestamp: now,
            agent: 'pog-task-manager',
            action: 'created',
            message: `Pulled from Jira (JQL=${jql})`,
        }],
    };
}
