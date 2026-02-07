import * as vscode from 'vscode';
import { TaskStore } from './store';

export class TaskWatcher {
    private watchers: vscode.Disposable[] = [];

    constructor(private store: TaskStore) {
        this.updateWatchers();

        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('pog.taskManager.taskDirectories')) {
                this.updateWatchers();
            }
        });
    }

    private updateWatchers() {
        this.dispose();

        const config = vscode.workspace.getConfiguration('pog.taskManager');
        const directories = config.get<string[]>('taskDirectories') || ['./pog-task/list'];

        for (const dir of directories) {
            // Remove trailing slash if present
            let cleanDir = dir.replace(/\/$/, '');
            // Remove leading ./ or /
            cleanDir = cleanDir.replace(/^\.?\//, '');

            const pattern = `${cleanDir}/**/*.jsonl`;

            // Create watcher for each configured directory
            // Note: createFileSystemWatcher pattern is glob string relative to workspace or absolute path glob
            // If dir starts with ./ it is relative. 
            // Better to rely on workspace relative patterns or absolute paths if provided. 
            // For simplicity we assume patterns work as workspace globs.
            const watcher = vscode.workspace.createFileSystemWatcher(pattern);

            watcher.onDidChange(() => this.store.load());
            watcher.onDidCreate(() => this.store.load());
            watcher.onDidDelete(() => this.store.load());

            this.watchers.push(watcher);
        }

        // Reload store when configuration changes
        this.store.load();
    }

    dispose() {
        this.watchers.forEach(w => w.dispose());
        this.watchers = [];
    }
}
