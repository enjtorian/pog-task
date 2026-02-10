import * as crypto from 'crypto';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { TaskStore } from '../core/store';
import { Task } from '../core/types';

export async function quickAddTask(store: TaskStore) {
    const title = await vscode.window.showInputBox({
        prompt: 'Enter Task Title',
        placeHolder: 'e.g., Fix login bug'
    });

    if (!title) { return; }

    // 1. Select or Enter Project
    const projects = store.getProjects();
    const createNewProjectItem = '$(plus) Create New Project...';
    const projectItems = [createNewProjectItem, ...projects];

    let project = await vscode.window.showQuickPick(projectItems, {
        placeHolder: 'Select Project'
    });

    if (!project) { return; }

    if (project === createNewProjectItem) {
        project = await vscode.window.showInputBox({
            prompt: 'Enter New Project Name',
            placeHolder: 'e.g., common'
        });
        if (!project) { return; }
    }

    // 2. Select or Enter Module
    const modules = store.getModules(project);
    const createNewModuleItem = '$(plus) Create New Module...';
    const moduleItems = [createNewModuleItem, ...modules];

    let module = await vscode.window.showQuickPick(moduleItems, {
        placeHolder: 'Select Module'
    });

    if (!module) { return; }

    if (module === createNewModuleItem) {
        module = await vscode.window.showInputBox({
            prompt: 'Enter New Module Name',
            placeHolder: 'e.g., core'
        });
        if (!module) { return; }
    }

    // 3. Generate Filename and Path
    const safeTitle = title.replace(/[^a-z0-9\u4e00-\u9fa5]+/gi, '_').replace(/^_+|_+$/g, '');
    const filename = `${safeTitle}.yaml`;

    // Assume standard structure: pog-task/list/{project}/{module}/{filename}
    // We should probably loop through workspace folders to find the root
    if (!vscode.workspace.workspaceFolders) {
        vscode.window.showErrorMessage('No workspace open');
        return;
    }

    const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    const taskDir = path.join(rootPath, 'pog-task', 'list', project, module);
    const filePath = path.join(taskDir, filename);

    // 4. Check for Existence
    if (fs.existsSync(filePath)) {
        vscode.window.showErrorMessage(`Task file already exists: ${filename}`);
        return;
    }

    // 5. Create Task
    const taskId = crypto.randomUUID();
    const newTask: Task = {
        type: 'task',
        id: taskId,
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

    // Ensure directory exists
    try {
        fs.mkdirSync(taskDir, { recursive: true });

        // Create record directory as well (optional but good practice per strict rules)
        const recordDir = path.join(taskDir, 'record', taskId);
        fs.mkdirSync(recordDir, { recursive: true });
        const recordPath = path.join(recordDir, 'record.md');
        fs.writeFileSync(recordPath, `# Task Record: ${title}\n\n`);

        newTask.record_path = `record/${taskId}/record.md`;

        await store.createTask(newTask, filePath);
        vscode.window.showInformationMessage(`Task "${title}" created at ${project}/${module}!`);
    } catch (e) {
        vscode.window.showErrorMessage(`Failed to create task: ${e}`);
        console.error(e);
    }
}
