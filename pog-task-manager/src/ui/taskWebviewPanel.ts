import * as vscode from 'vscode';
import * as yaml from 'js-yaml';
import { TaskStore } from '../core/store';
import { Task } from '../core/types';

export class TaskWebviewPanel {
    public static currentPanel: TaskWebviewPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];
    private _currentTask: Task;

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, task: Task, private store: TaskStore) {
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._currentTask = task;

        this._update();

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        this._panel.webview.onDidReceiveMessage(
            async message => {
                switch (message.command) {
                    case 'updateTask':
                        const oldStatus = this._currentTask.status;
                        const newStatus = message.data.status;

                        await this.store.saveTask(this._currentTask, message.data);
                        vscode.window.showInformationMessage('Task saved!');

                        // Check if we should prompt for record.md
                        if (oldStatus !== 'in_progress' && newStatus === 'in_progress') {
                            const selection = await vscode.window.showInformationMessage(
                                'Task started. Do you want to open or update the task record?',
                                'Open Record'
                            );
                            if (selection === 'Open Record') {
                                await this.openOrCreateRecord();
                            }
                        }
                        return;
                    case 'openFile':
                        const filePath = message.path;
                        try {
                            // Resolve relative path from workspace root if needed, or assume absolute/relative to workspace
                            // Our task data usually stores relative paths e.g. "pog-task/list/record/..."
                            const workspaceFolders = vscode.workspace.workspaceFolders;
                            if (!workspaceFolders) { return; }

                            const rootUri = workspaceFolders[0].uri;
                            const fileUri = vscode.Uri.joinPath(rootUri, filePath);

                            const doc = await vscode.workspace.openTextDocument(fileUri);
                            await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
                        } catch (e) {
                            vscode.window.showErrorMessage(`Could not open file: ${filePath}`);
                        }
                        return;
                    case 'copyExecutePrompt':
                        await vscode.commands.executeCommand('pog-task-manager.copyExecutePrompt', this._currentTask);
                        return;
                    case 'copyCreatePrompt':
                        await vscode.commands.executeCommand('pog-task-manager.copyCreatePrompt', this._currentTask);
                        return;
                    case 'openRecord':
                    case 'createRecord':
                        await this.openOrCreateRecord();
                        // Refresh to show updated UI state (e.g. now button says Open instead of Create)
                        // Triggered by watcher, but explicit update helps immediate feedback if created
                        return;
                }
            },
            null,
            this._disposables
        );
    }

    public static createOrShow(extensionUri: vscode.Uri, task: Task, store: TaskStore) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        // Ensure we create a new panel for different tasks, or reuse if same?
        // For simplicity, let's allow single panel for now to avoid complexity.
        if (TaskWebviewPanel.currentPanel) {
            TaskWebviewPanel.currentPanel._panel.reveal(column);
            TaskWebviewPanel.currentPanel._updateTask(task);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            'taskDetail',
            `Task: ${task.title}`,
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
            }
        );

        TaskWebviewPanel.currentPanel = new TaskWebviewPanel(panel, extensionUri, task, store);
    }

    private _updateTask(task: Task) {
        this._currentTask = task;
        this._panel.title = `Task: ${task.title}`;
        this._update();
    }

    public dispose() {
        TaskWebviewPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private async _update() {
        const webview = this._panel.webview;

        // Auto-discover files in record directory
        const project = this._currentTask._project || 'alpha';
        const module = this._currentTask._module || 'activate';
        const recordDir = `pog-task/list/${project}/${module}/record/${this._currentTask.id}`;
        const workspaceFolders = vscode.workspace.workspaceFolders;
        let autoDiscoveredFiles: string[] = [];
        let recordMdExists = false;

        if (workspaceFolders) {
            const rootUri = workspaceFolders[0].uri;
            const recordDirUri = vscode.Uri.joinPath(rootUri, recordDir);
            const recordMdUri = vscode.Uri.joinPath(recordDirUri, 'record.md');

            try {
                // Check if directory exists
                await vscode.workspace.fs.stat(recordDirUri);

                // Check if record.md exists
                try {
                    await vscode.workspace.fs.stat(recordMdUri);
                    recordMdExists = true;
                } catch {
                    recordMdExists = false;
                }

                // Find all files in that directory (recursive)
                const relativePattern = new vscode.RelativePattern(rootUri, `${recordDir}/**/*`);
                const files = await vscode.workspace.findFiles(relativePattern);

                autoDiscoveredFiles = files.map(file => vscode.workspace.asRelativePath(file));
            } catch (e) {
                // Directory doesn't exist, ignore
            }
        }

        // Merge and deduplicate
        const allRelatedFiles = Array.from(new Set([
            ...(this._currentTask.related_files || []),
            ...autoDiscoveredFiles
        ]));

        this._panel.webview.html = this._getHtmlForWebview(webview, this._currentTask, allRelatedFiles, recordMdExists);
    }

    private _getHtmlForWebview(webview: vscode.Webview, task: Task, relatedFiles: string[], recordMdExists: boolean) {
        // Simple HTML Form
        const relatedFilesHtml = relatedFiles.map(file => `
            <div class="file-link" onclick="openFile('${file}')">
                <span class="codicon codicon-file"></span>
                ${file}
            </div>
        `).join('');

        const recordButton = recordMdExists
            ? `<button onclick="openRecord()" style="background: var(--vscode-button-secondaryBackground); color: var(--vscode-button-secondaryForeground);">Open Record.md</button>`
            : `<button onclick="createRecord()" style="background: var(--vscode-button-secondaryBackground); color: var(--vscode-button-secondaryForeground);">Create Record.md</button>`;

        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Task Details</title>
                <style>
                    body { font-family: var(--vscode-font-family); padding: 20px; color: var(--vscode-editor-foreground); }
                    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                    .collapse-btn { padding: 4px 12px; background: var(--vscode-button-secondaryBackground); color: var(--vscode-button-secondaryForeground); border: none; cursor: pointer; border-radius: 3px; }
                    .collapse-btn:hover { background: var(--vscode-button-secondaryHoverBackground); }
                    .task-detail { transition: max-height 0.3s ease-out, opacity 0.3s ease-out; overflow: hidden; }
                    .task-detail.collapsed { max-height: 0; opacity: 0; }
                    .task-detail.expanded { max-height: 5000px; opacity: 1; }
                    .form-group { margin-bottom: 15px; }
                    label { display: block; margin-bottom: 5px; font-weight: bold; }
                    input, textarea, select { width: 100%; padding: 8px; background: var(--vscode-input-background); color: var(--vscode-input-foreground); border: 1px solid var(--vscode-input-border); }
                    button { padding: 8px 16px; background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; cursor: pointer; }
                    button:hover { background: var(--vscode-button-hoverBackground); }
                    .file-link { cursor: pointer; color: var(--vscode-textLink-foreground); margin: 5px 0; display: flex; align-items: center; gap: 5px; }
                    .file-link:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h2>Task: ${task.title} <span style="font-size: 0.8em; color: gray">(${task.id})</span></h2>
                    <button class="collapse-btn" onclick="toggleCollapse()" id="collapseBtn">Collapse</button>
                </div>
                
                <div class="task-detail expanded" id="taskDetail">
                <div class="form-group">
                    <label>Status</label>
                    <select id="status">
                        <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="in_design" ${task.status === 'in_design' ? 'selected' : ''}>In Design</option>
                        <option value="in_planning" ${task.status === 'in_planning' ? 'selected' : ''}>In Planning</option>
                        <option value="in_progress" ${task.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                        <option value="in_review" ${task.status === 'in_review' ? 'selected' : ''}>In Review</option>
                        <option value="blocked" ${task.status === 'blocked' ? 'selected' : ''}>Blocked</option>
                        <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
                        <option value="cancelled" ${task.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Priority</label>
                    <select id="priority">
                        <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
                        <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
                        <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
                        <option value="critical" ${task.priority === 'critical' ? 'selected' : ''}>Critical</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Description</label>
                    <textarea id="description" rows="10">${task.description || ''}</textarea>
                </div>

                <div class="form-group">
                    <label>Related Files</label>
                    ${relatedFilesHtml || 'No related files'}
                </div>

                <div class="form-group">
                    <label>Project Record</label>
                    ${recordButton}
                </div>

                <div class="form-group">
                    <details>
                        <summary style="cursor: pointer; color: var(--vscode-descriptionForeground);">Debug: Raw YAML</summary>
                        <pre style="background: var(--vscode-textBlockQuote-background); padding: 10px; overflow: auto; font-size: 0.9em;">${yaml.dump(task)}</pre>
                    </details>
                </div>

                <div style="margin-top: 20px; display: flex; gap: 10px;">
                    <button onclick="save()">Save</button>
                    <button onclick="copyExecutePrompt()">Copy Execute Prompt</button>
                    <button onclick="copyCreatePrompt()">Copy Create Prompt</button>
                </div>
                </div>
                
                <script>
                    const vscode = acquireVsCodeApi();
                    
                    // Collapse/Expand functionality
                    let isCollapsed = false;
                    
                    function toggleCollapse() {
                        const taskDetail = document.getElementById('taskDetail');
                        const collapseBtn = document.getElementById('collapseBtn');
                        
                        isCollapsed = !isCollapsed;
                        
                        if (isCollapsed) {
                            taskDetail.classList.remove('expanded');
                            taskDetail.classList.add('collapsed');
                            collapseBtn.textContent = 'Expand';
                        } else {
                            taskDetail.classList.remove('collapsed');
                            taskDetail.classList.add('expanded');
                            collapseBtn.textContent = 'Collapse';
                        }
                    }
                    
                    function save() {
                        const status = document.getElementById('status').value;
                        const priority = document.getElementById('priority').value;
                        const description = document.getElementById('description').value;
                        
                        vscode.postMessage({
                            command: 'updateTask',
                            data: { status, priority, description }
                        });
                    }

                    function copyExecutePrompt() {
                        vscode.postMessage({
                            command: 'copyExecutePrompt'
                        });
                    }

                    function copyCreatePrompt() {
                        vscode.postMessage({
                            command: 'copyCreatePrompt'
                        });
                    }
                    
                    function openRecord() {
                        vscode.postMessage({
                            command: 'openRecord'
                        });
                    }
                    
                    function createRecord() {
                        vscode.postMessage({
                            command: 'createRecord'
                        });
                    }

                    function openFile(path) {
                        vscode.postMessage({
                            command: 'openFile',
                            path: path
                        });
                    }
                </script>
            </body>
            </html>`;
    }

    private async openOrCreateRecord() {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) { return; }

        const rootUri = workspaceFolders[0].uri;
        const project = this._currentTask._project || 'alpha';
        const module = this._currentTask._module || 'activate';
        const recordDir = `pog-task/list/${project}/${module}/record/${this._currentTask.id}`;
        const recordDirUri = vscode.Uri.joinPath(rootUri, recordDir);
        const recordMdUri = vscode.Uri.joinPath(recordDirUri, 'record.md');

        try {
            // Check if exists
            await vscode.workspace.fs.stat(recordMdUri);
        } catch {
            // Create if not exists
            try {
                await vscode.workspace.fs.createDirectory(recordDirUri);
                // Template content
                const template = `# Task Record: ${this._currentTask.title}\n\n## Original Prompt\n\n\`\`\`\n\n\`\`\`\n\n## Implementation Plan\n\n`;
                await vscode.workspace.fs.writeFile(recordMdUri, Buffer.from(template));
            } catch (e) {
                vscode.window.showErrorMessage('Failed to create record.md');
                return;
            }
        }

        try {
            await vscode.commands.executeCommand('markdown.showPreviewToSide', recordMdUri);
        } catch (e) {
            vscode.window.showErrorMessage('Failed to open record.md');
        }
    }

    private escapeHtml(unsafe: string) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}
