import * as crypto from 'crypto';
import * as vscode from 'vscode';
import { TaskStore } from '../core/store';
import { Task } from '../core/types';

export async function quickAddTask(store: TaskStore) {
    const title = await vscode.window.showInputBox({
        prompt: 'Enter Task Title',
        placeHolder: 'e.g., Fix login bug'
    });

    if (!title) { return; }

    const files = store.getLoadedFiles();
    let targetFile: string | undefined;

    if (files.length === 0) {
        vscode.window.showErrorMessage('No task files found. Please create a .jsonl file in pog-task/list/ first.');
        return;
    } else if (files.length === 1) {
        targetFile = files[0];
    } else {
        targetFile = await vscode.window.showQuickPick(files, {
            placeHolder: 'Select target file'
        });
    }

    if (!targetFile) { return; }

    const newTask: Task = {
        type: 'task',
        id: crypto.randomUUID(),
        title: title,
        description: '',
        category: 'feature', // default
        priority: 'medium',
        status: 'pending',
        created_at: new Date().toISOString(),
        history: [{
            timestamp: new Date().toISOString(),
            agent: 'user',
            action: 'created',
            message: 'Quick Add via POG Task Manager'
        }]
    };

    try {
        await store.createTask(newTask, targetFile);
        vscode.window.showInformationMessage(`Task "${title}" created!`);
    } catch (e) {
        vscode.window.showErrorMessage('Failed to create task');
        console.error(e);
    }
}
