import * as crypto from 'crypto';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { TaskStore } from '../core/store';
import { Task } from '../core/types';

export async function quickAddTask(store: TaskStore) {
    // 1. Select or Enter Project (先選 project)
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

    // 2. Select or Enter Module (再選 module)
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

    // 3. Enter Task Title (最後輸入 task name)
    const title = await vscode.window.showInputBox({
        prompt: 'Enter Task Title',
        placeHolder: 'e.g., Fix login bug'
    });

    if (!title) { return; }

    // 4. Generate Filename and Path
    const safeTitle = title.replace(/[^a-z0-9\u4e00-\u9fa5]+/gi, '_').replace(/^_+|_+$/g, '');
    const filename = `${safeTitle}.yaml`;

    if (!vscode.workspace.workspaceFolders) {
        vscode.window.showErrorMessage('No workspace open');
        return;
    }

    const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    const taskDir = path.join(rootPath, 'pog-task', 'list', project, module);
    const filePath = path.join(taskDir, filename);

    // 5. Check for Existence
    if (fs.existsSync(filePath)) {
        vscode.window.showErrorMessage(`Task file already exists: ${filename}`);
        return;
    }

    // 6. Create Task (不建立 record.md)
    const taskId = crypto.randomUUID();
    const newTask: Task = {
        type: 'task',
        id: taskId,
        title: title,
        description: '',
        category: 'feature',
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

        await store.createTask(newTask, filePath);

        // 建立後立即執行 refresh
        await store.load();

        vscode.window.showInformationMessage(`Task "${title}" created at ${project}/${module}!`);
    } catch (e) {
        vscode.window.showErrorMessage(`Failed to create task: ${e}`);
        console.error(e);
    }
}
