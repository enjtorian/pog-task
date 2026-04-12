import * as vscode from 'vscode';
import { TaskStore } from '../core/store';
import { Task } from '../core/types';

export class TaskDashboardPanel {
    public static currentPanel: TaskDashboardPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];

    private constructor(panel: vscode.WebviewPanel, private store: TaskStore) {
        this._panel = panel;
        this._update();

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // Listen for store updates
        this.store.onDidUpdate(() => {
            if (this._panel.visible) {
                this._update();
            }
        });
    }

    public static createOrShow(store: TaskStore) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (TaskDashboardPanel.currentPanel) {
            TaskDashboardPanel.currentPanel._panel.reveal(column);
            TaskDashboardPanel.currentPanel._update();
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            'taskDashboard',
            'POG Task Dashboard',
            column || vscode.ViewColumn.One,
            { enableScripts: true }
        );

        TaskDashboardPanel.currentPanel = new TaskDashboardPanel(panel, store);
    }

    public dispose() {
        TaskDashboardPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) { x.dispose(); }
        }
    }

    private _update() {
        this._panel.webview.html = this._getHtml();
    }

    private _getHtml(): string {
        const allTasks = this.store.getAllTasks();
        const projects = this.store.getProjects();

        // Status stats
        const statusCounts: Record<string, number> = {};
        const statusLabels: Record<string, string> = {
            pending: 'Pending',
            in_design: 'In Design',
            in_planning: 'In Planning',
            in_progress: 'In Progress',
            in_review: 'In Review',
            blocked: 'Blocked',
            completed: 'Completed',
            cancelled: 'Cancelled'
        };
        const statusColors: Record<string, string> = {
            pending: '#6b7280',
            in_design: '#a855f7',
            in_planning: '#3b82f6',
            in_progress: '#f59e0b',
            in_review: '#06b6d4',
            blocked: '#ef4444',
            completed: '#22c55e',
            cancelled: '#9ca3af'
        };

        for (const status of Object.keys(statusLabels)) {
            statusCounts[status] = 0;
        }
        for (const task of allTasks) {
            statusCounts[task.status] = (statusCounts[task.status] || 0) + 1;
        }

        // Priority stats
        const priorityCounts: Record<string, number> = { low: 0, medium: 0, high: 0, critical: 0 };
        const priorityColors: Record<string, string> = {
            low: '#6b7280',
            medium: '#3b82f6',
            high: '#f59e0b',
            critical: '#ef4444'
        };
        for (const task of allTasks) {
            if (task.priority) {
                priorityCounts[task.priority] = (priorityCounts[task.priority] || 0) + 1;
            }
        }

        // Project breakdown
        const projectStats: { name: string; modules: { name: string; total: number; completed: number; inProgress: number }[] }[] = [];
        for (const project of projects) {
            const modules = this.store.getModules(project);
            const moduleStats = modules.map(mod => {
                const tasks = allTasks.filter(t => t._project === project && t._module === mod);
                return {
                    name: mod,
                    total: tasks.length,
                    completed: tasks.filter(t => t.status === 'completed').length,
                    inProgress: tasks.filter(t => t.status === 'in_progress').length
                };
            });
            projectStats.push({ name: project, modules: moduleStats });
        }

        // Generate status cards HTML
        const statusCardsHtml = Object.entries(statusCounts)
            .filter(([, count]) => count > 0)
            .map(([status, count]) => `
                <div class="stat-card" style="border-left: 4px solid ${statusColors[status] || '#666'};">
                    <div class="stat-number">${count}</div>
                    <div class="stat-label">${statusLabels[status] || status}</div>
                </div>
            `).join('');

        // Generate priority cards HTML
        const priorityCardsHtml = Object.entries(priorityCounts)
            .filter(([, count]) => count > 0)
            .map(([priority, count]) => `
                <div class="stat-card" style="border-left: 4px solid ${priorityColors[priority] || '#666'};">
                    <div class="stat-number">${count}</div>
                    <div class="stat-label">${priority.charAt(0).toUpperCase() + priority.slice(1)}</div>
                </div>
            `).join('');

        // Generate project breakdown HTML
        const projectBreakdownHtml = projectStats.map(project => {
            const modulesHtml = project.modules.map(mod => {
                const pct = mod.total > 0 ? Math.round((mod.completed / mod.total) * 100) : 0;
                return `
                    <div class="module-row">
                        <div class="module-name">${mod.name}</div>
                        <div class="module-stats">
                            <span class="badge badge-total">${mod.total}</span>
                            ${mod.inProgress > 0 ? `<span class="badge badge-progress">${mod.inProgress} active</span>` : ''}
                            <span class="badge badge-done">${mod.completed} done</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${pct}%;"></div>
                        </div>
                    </div>
                `;
            }).join('');

            const totalTasks = project.modules.reduce((s, m) => s + m.total, 0);
            const totalCompleted = project.modules.reduce((s, m) => s + m.completed, 0);

            return `
                <div class="project-section">
                    <div class="project-header">
                        <span class="project-name">${project.name}</span>
                        <span class="project-summary">${totalCompleted}/${totalTasks} completed</span>
                    </div>
                    ${modulesHtml}
                </div>
            `;
        }).join('');

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>POG Task Dashboard</title>
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
            transition: transform 0.15s;
        }
        .stat-card:hover { transform: translateY(-2px); }
        .stat-number {
            font-size: 1.8em;
            font-weight: bold;
            line-height: 1.2;
        }
        .stat-label {
            font-size: 0.85em;
            color: var(--vscode-descriptionForeground);
            margin-top: 2px;
        }
        .project-section {
            background: var(--vscode-input-background);
            border-radius: 6px;
            padding: 14px;
            margin-bottom: 12px;
        }
        .project-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        .project-name {
            font-weight: bold;
            font-size: 1.05em;
        }
        .project-summary {
            color: var(--vscode-descriptionForeground);
            font-size: 0.85em;
        }
        .module-row {
            display: grid;
            grid-template-columns: 150px 1fr 120px;
            gap: 10px;
            align-items: center;
            padding: 6px 0;
            border-top: 1px solid var(--vscode-widget-border);
        }
        .module-name {
            font-size: 0.9em;
        }
        .module-stats {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
        }
        .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 0.75em;
        }
        .badge-total {
            background: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
        }
        .badge-progress {
            background: rgba(245, 158, 11, 0.2);
            color: #f59e0b;
        }
        .badge-done {
            background: rgba(34, 197, 94, 0.2);
            color: #22c55e;
        }
        .progress-bar {
            height: 6px;
            background: var(--vscode-progressBar-background);
            border-radius: 3px;
            overflow: hidden;
            opacity: 0.3;
        }
        .progress-fill {
            height: 100%;
            background: #22c55e;
            border-radius: 3px;
            transition: width 0.3s;
        }
        .overview-number {
            font-size: 2.5em;
            font-weight: bold;
            text-align: center;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <h1>📊 POG Task Dashboard</h1>
    <div class="subtitle">Total: ${allTasks.length} tasks across ${projects.length} projects</div>

    <div class="section-title">Status Overview</div>
    <div class="stat-grid">
        ${statusCardsHtml || '<div class="stat-label">No tasks yet</div>'}
    </div>

    <div class="section-title">Priority Distribution</div>
    <div class="stat-grid">
        ${priorityCardsHtml || '<div class="stat-label">No tasks yet</div>'}
    </div>

    <div class="section-title">Project Breakdown</div>
    ${projectBreakdownHtml || '<div class="stat-label">No projects yet</div>'}
</body>
</html>`;
    }
}
