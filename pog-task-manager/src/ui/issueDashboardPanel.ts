import * as vscode from 'vscode';
import { TaskStore } from '../core/store';
import { Task } from '../core/types';

const STATUS_LABELS: Record<string, string> = {
    pending: 'Pending',
    in_design: 'In Design',
    in_planning: 'In Planning',
    in_progress: 'In Progress',
    in_review: 'In Review',
    blocked: 'Blocked',
    completed: 'Completed',
    cancelled: 'Cancelled'
};

const STATUS_COLORS: Record<string, string> = {
    pending: '#6b7280',
    in_design: '#a855f7',
    in_planning: '#3b82f6',
    in_progress: '#f59e0b',
    in_review: '#06b6d4',
    blocked: '#ef4444',
    completed: '#22c55e',
    cancelled: '#9ca3af'
};

const STATUS_ORDER = [
    'pending', 'in_design', 'in_planning', 'in_progress',
    'in_review', 'blocked', 'completed', 'cancelled'
];

export class IssueDashboardPanel {
    public static currentPanel: IssueDashboardPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];

    private constructor(panel: vscode.WebviewPanel, private store: TaskStore) {
        this._panel = panel;
        this._update();

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        this.store.onDidUpdate(() => {
            if (this._panel.visible) {
                this._update();
            }
        });

        this._panel.webview.onDidReceiveMessage(
            (msg) => this._handleMessage(msg),
            null,
            this._disposables
        );
    }

    public static createOrShow(store: TaskStore) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (IssueDashboardPanel.currentPanel) {
            IssueDashboardPanel.currentPanel._panel.reveal(column);
            IssueDashboardPanel.currentPanel._update();
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            'issueDashboard',
            'POG Issue Task Dashboard',
            column || vscode.ViewColumn.One,
            { enableScripts: true }
        );

        IssueDashboardPanel.currentPanel = new IssueDashboardPanel(panel, store);
    }

    public dispose() {
        IssueDashboardPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) { x.dispose(); }
        }
    }

    private _handleMessage(msg: { command?: string; taskId?: string }) {
        if (!msg || !msg.command) { return; }
        const task = msg.taskId ? this.store.getTask(msg.taskId) : undefined;
        switch (msg.command) {
            case 'openTask':
                if (task) {
                    vscode.commands.executeCommand('pog-task-manager.openTaskDetail', task);
                }
                return;
            case 'analyze':
                if (task) {
                    vscode.commands.executeCommand('pog-task-manager.copyAnalyzePrompt', task);
                }
                return;
            case 'execute':
                if (task) {
                    vscode.commands.executeCommand('pog-task-manager.copyExecutePrompt', task);
                }
                return;
            case 'push':
                if (task) {
                    vscode.commands.executeCommand('pog-task-manager.jira.pushIssueTask', task);
                }
                return;
        }
    }

    private _update() {
        this._panel.webview.html = this._getHtml();
    }

    private _getHtml(): string {
        const issueTasks = this.store.getAllTasks()
            .filter(t => typeof t.issue === 'string' && t.issue.trim().length > 0);

        const statusCounts: Record<string, number> = {};
        for (const s of STATUS_ORDER) { statusCounts[s] = 0; }
        for (const t of issueTasks) {
            statusCounts[t.status] = (statusCounts[t.status] || 0) + 1;
        }

        const cardsHtml = STATUS_ORDER
            .filter(s => statusCounts[s] > 0)
            .map(s => `
                <div class="stat-card" style="border-left: 4px solid ${STATUS_COLORS[s]};">
                    <div class="stat-number">${statusCounts[s]}</div>
                    <div class="stat-label">${STATUS_LABELS[s]}</div>
                </div>
            `).join('');

        const groupsHtml = STATUS_ORDER
            .map(s => ({ status: s, tasks: issueTasks.filter(t => t.status === s) }))
            .filter(g => g.tasks.length > 0)
            .map(g => {
                const rows = g.tasks
                    .sort((a, b) => (a.issue || '').localeCompare(b.issue || ''))
                    .map(t => renderRow(t))
                    .join('');
                return `
                    <div class="group">
                        <div class="group-header">
                            <span class="dot" style="background:${STATUS_COLORS[g.status]};"></span>
                            <span class="group-title">${STATUS_LABELS[g.status]}</span>
                            <span class="group-count">${g.tasks.length}</span>
                        </div>
                        <div class="rows">
                            ${rows}
                        </div>
                    </div>
                `;
            }).join('');

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>POG Issue Task Dashboard</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            padding: 20px;
            color: var(--vscode-editor-foreground);
            background: var(--vscode-editor-background);
        }
        h1 { margin-bottom: 5px; }
        .subtitle {
            color: var(--vscode-descriptionForeground);
            margin-bottom: 24px;
            font-size: 0.9em;
        }
        .section-title {
            font-size: 1.1em;
            font-weight: bold;
            margin: 24px 0 12px 0;
            padding-bottom: 6px;
            border-bottom: 1px solid var(--vscode-widget-border);
        }
        .stat-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 12px;
            margin-bottom: 16px;
        }
        .stat-card {
            background: var(--vscode-input-background);
            border-radius: 6px;
            padding: 14px;
        }
        .stat-number { font-size: 1.8em; font-weight: bold; line-height: 1.2; }
        .stat-label { font-size: 0.85em; color: var(--vscode-descriptionForeground); margin-top: 2px; }

        .group { margin-bottom: 18px; }
        .group-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 6px;
            padding-bottom: 4px;
            border-bottom: 1px dashed var(--vscode-widget-border);
        }
        .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
        .group-title { font-weight: bold; }
        .group-count {
            margin-left: auto;
            background: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
            padding: 1px 8px;
            border-radius: 10px;
            font-size: 0.8em;
        }
        .rows { display: flex; flex-direction: column; gap: 4px; }
        .row {
            display: grid;
            grid-template-columns: 110px 1fr 220px 120px;
            gap: 8px;
            padding: 8px 10px;
            border-radius: 4px;
            background: var(--vscode-input-background);
            align-items: center;
        }
        .row:hover { background: var(--vscode-list-hoverBackground); }
        .issue-key {
            font-family: var(--vscode-editor-font-family, monospace);
            font-weight: bold;
        }
        .title {
            cursor: pointer;
            text-decoration: none;
            color: var(--vscode-editor-foreground);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .title:hover { color: var(--vscode-textLink-foreground); }
        .meta {
            color: var(--vscode-descriptionForeground);
            font-size: 0.8em;
        }
        .actions { display: flex; gap: 4px; justify-content: flex-end; }
        button.action {
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
            border: 0;
            padding: 3px 8px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 0.78em;
        }
        button.action:hover { background: var(--vscode-button-secondaryHoverBackground); }
        .empty {
            color: var(--vscode-descriptionForeground);
            padding: 30px 0;
            text-align: center;
        }
    </style>
</head>
<body>
    <h1>🧭 POG Issue Task Dashboard</h1>
    <div class="subtitle">${issueTasks.length} issue task(s) tracked from Jira</div>

    <div class="section-title">Status Overview</div>
    <div class="stat-grid">
        ${cardsHtml || '<div class="stat-label">No issue tasks yet — pull from Jira to populate.</div>'}
    </div>

    <div class="section-title">Issue Tasks by Status</div>
    ${groupsHtml || '<div class="empty">Pull issues from Jira to see them here.</div>'}

    <script>
        const vscode = acquireVsCodeApi();
        document.querySelectorAll('[data-action]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = el.getAttribute('data-id');
                const action = el.getAttribute('data-action');
                vscode.postMessage({ command: action, taskId: id });
            });
        });
        document.querySelectorAll('[data-open]').forEach(el => {
            el.addEventListener('click', () => {
                vscode.postMessage({ command: 'openTask', taskId: el.getAttribute('data-open') });
            });
        });
    </script>
</body>
</html>`;
    }
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function renderRow(t: Task): string {
    const issue = escapeHtml(t.issue || '');
    const title = escapeHtml(t.title || '');
    const project = escapeHtml(t._project || '');
    const module = escapeHtml(t._module || '');
    const id = escapeHtml(t.id);
    return `
        <div class="row">
            <span class="issue-key">${issue}</span>
            <a class="title" data-open="${id}" title="Open detail">${title}</a>
            <span class="meta">${project}/${module}</span>
            <div class="actions">
                <button class="action" data-action="analyze" data-id="${id}" title="Copy analyze prompt">Analyze</button>
                <button class="action" data-action="execute" data-id="${id}" title="Copy execute prompt">Execute</button>
                <button class="action" data-action="push" data-id="${id}" title="Push to Jira">Push</button>
            </div>
        </div>
    `;
}
