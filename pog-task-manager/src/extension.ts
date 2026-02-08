import * as vscode from 'vscode';
import { copyCreatePrompt, copyExecutePrompt, copyTaskContext } from './commands/agentCommands';
import { copyPromptTemplate, openPromptTemplateFile, previewPromptTemplate } from './commands/promptTemplateCommands';
import { quickAddTask } from './commands/quickAdd';
import { initPogTask } from './commands/initPogTask';
import { PromptTemplateStore } from './core/promptTemplateStore';
import { TaskStore } from './core/store';
import { Task } from './core/types';
import { TaskWatcher } from './core/watcher';
import { PromptTemplateTreeDataProvider } from './ui/promptTemplateTreeView';
import { ProjectItem, TaskTreeDataProvider } from './ui/taskTreeDataProvider';
import { TaskWebviewPanel } from './ui/taskWebviewPanel';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "pog-task-manager" is now active!');

    // Task management
    const store = new TaskStore();
    const watcher = new TaskWatcher(store);
    const treeDataProvider = new TaskTreeDataProvider(store);

    // Prompt Template management
    const promptTemplateStore = new PromptTemplateStore();
    const promptTemplateTreeProvider = new PromptTemplateTreeDataProvider(promptTemplateStore);

    // Initial load
    store.load();

    // Task commands
    const refreshDisposable = vscode.commands.registerCommand('pog-task-manager.refreshTasks', () => {
        store.load();
        vscode.window.showInformationMessage('Tasks refreshed!');
    });

    const openTaskDisposable = vscode.commands.registerCommand('pog-task-manager.openTaskDetail', (task: Task) => {
        TaskWebviewPanel.createOrShow(context.extensionUri, task, store);
    });

    const quickAddDisposable = vscode.commands.registerCommand('pog-task-manager.quickAdd', () => {
        quickAddTask(store);
    });

    const initPogTaskDisposable = vscode.commands.registerCommand('pog-task-manager.initPogTask', () => {
        initPogTask();
    });

    const copyExecutePromptDisposable = vscode.commands.registerCommand('pog-task-manager.copyExecutePrompt', (task: Task) => {
        copyExecutePrompt(store, task);
    });

    const copyContextDisposable = vscode.commands.registerCommand('pog-task-manager.copyContext', (task: Task) => {
        copyTaskContext(task);
    });

    const copyCreatePromptDisposable = vscode.commands.registerCommand('pog-task-manager.copyCreatePrompt', (task: Task) => {
        copyCreatePrompt(task);
    });

    // Filter commands
    const filterByStatusDisposable = vscode.commands.registerCommand('pog-task-manager.filterByStatus', async () => {
        const statuses = [
            { label: 'Pending', value: 'pending' },
            { label: 'In Design', value: 'in_design' },
            { label: 'In Planning', value: 'in_planning' },
            { label: 'In Progress', value: 'in_progress' },
            { label: 'In Review', value: 'in_review' },
            { label: 'Blocked', value: 'blocked' },
            { label: 'Completed', value: 'completed' },
            { label: 'Cancelled', value: 'cancelled' }
        ];

        const currentFilter = treeDataProvider.getStatusFilter();
        const selected = await vscode.window.showQuickPick(statuses, {
            canPickMany: true,
            placeHolder: 'Select statuses to filter',
            title: 'Filter Tasks by Status'
        });

        if (selected) {
            const selectedStatuses = selected.map(s => s.value);
            treeDataProvider.setStatusFilter(selectedStatuses);

            if (selectedStatuses.length > 0) {
                vscode.window.showInformationMessage(`Filtering by: ${selectedStatuses.join(', ')}`);
            }
        }
    });

    const clearFilterDisposable = vscode.commands.registerCommand('pog-task-manager.clearFilter', () => {
        treeDataProvider.clearFilter();
        vscode.window.showInformationMessage('Filter cleared!');
    });

    const collapseAllDisposable = vscode.commands.registerCommand('pog-task-manager.collapseAll', () => {
        vscode.commands.executeCommand('workbench.actions.treeView.pog-task-manager.taskList.collapseAll');
    });

    const expandAllDisposable = vscode.commands.registerCommand('pog-task-manager.expandAll', async () => {
        // Expand all projects and modules
        const projects = store.getProjects();
        for (const project of projects) {
            const projectItem = new ProjectItem(project);
            try {
                await taskListView.reveal(projectItem, { expand: 2, select: false, focus: false });
            } catch (e) {
                console.log(`Failed to expand project ${project}:`, e);
            }
        }
    });

    // Prompt Template commands
    const refreshPromptTemplatesDisposable = vscode.commands.registerCommand('pog-task-manager.refreshPromptTemplates', () => {
        promptTemplateTreeProvider.refresh();
        vscode.window.showInformationMessage('Prompt templates refreshed!');
    });

    const copyPromptTemplateDisposable = vscode.commands.registerCommand('pog-task-manager.copyPromptTemplate', (item: any) => {
        if (item.template) {
            copyPromptTemplate(item.template, promptTemplateStore);
        }
    });

    const previewPromptTemplateDisposable = vscode.commands.registerCommand('pog-task-manager.previewPromptTemplate', (item: any) => {
        if (item.template) {
            previewPromptTemplate(item.template, promptTemplateStore);
        }
    });

    const openPromptTemplateFileDisposable = vscode.commands.registerCommand('pog-task-manager.openPromptTemplateFile', (item: any) => {
        if (item.template) {
            openPromptTemplateFile(item.template);
        }
    });

    // Register tree data providers
    const taskListView = vscode.window.createTreeView('pog-task-manager.taskList', {
        treeDataProvider: treeDataProvider
    });
    vscode.window.registerTreeDataProvider('pog-task-manager.promptTemplates', promptTemplateTreeProvider);

    // Add to subscriptions
    context.subscriptions.push(watcher);
    context.subscriptions.push(taskListView);
    context.subscriptions.push(refreshDisposable);
    context.subscriptions.push(openTaskDisposable);
    context.subscriptions.push(quickAddDisposable);
    context.subscriptions.push(initPogTaskDisposable);
    context.subscriptions.push(copyExecutePromptDisposable);
    context.subscriptions.push(copyContextDisposable);
    context.subscriptions.push(copyCreatePromptDisposable);
    context.subscriptions.push(filterByStatusDisposable);
    context.subscriptions.push(clearFilterDisposable);
    context.subscriptions.push(collapseAllDisposable);
    context.subscriptions.push(expandAllDisposable);
    context.subscriptions.push(refreshPromptTemplatesDisposable);
    context.subscriptions.push(copyPromptTemplateDisposable);
    context.subscriptions.push(previewPromptTemplateDisposable);
    context.subscriptions.push(openPromptTemplateFileDisposable);

    // Expose store for testing if needed
    return { store, promptTemplateStore };
}

export function deactivate() { }
