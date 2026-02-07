import * as vscode from 'vscode';
import { TaskStore } from '../core/store';
import { Task } from '../core/types';

// Define Tree Item Types
export class ProjectItem {
    constructor(public readonly name: string) { }
}

export class ModuleItem {
    constructor(public readonly project: string, public readonly name: string) { }
}

type TreeElement = ProjectItem | ModuleItem | Task;

export class TaskTreeDataProvider implements vscode.TreeDataProvider<TreeElement> {
    private _onDidChangeTreeData: vscode.EventEmitter<TreeElement | undefined | null | void> = new vscode.EventEmitter<TreeElement | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<TreeElement | undefined | null | void> = this._onDidChangeTreeData.event;
    private _statusFilter: Set<string> = new Set();

    constructor(private store: TaskStore) {
        this.store.onDidUpdate(() => this.refresh());
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    setStatusFilter(statuses: string[]): void {
        this._statusFilter = new Set(statuses);
        this.refresh();
    }

    getStatusFilter(): string[] {
        return Array.from(this._statusFilter);
    }

    clearFilter(): void {
        this._statusFilter.clear();
        this.refresh();
    }

    hasFilter(): boolean {
        return this._statusFilter.size > 0;
    }

    getTreeItem(element: TreeElement): vscode.TreeItem {
        if (element instanceof ProjectItem) {
            const treeItem = new vscode.TreeItem(element.name, vscode.TreeItemCollapsibleState.Expanded);
            treeItem.contextValue = 'project';
            treeItem.iconPath = new vscode.ThemeIcon('project');
            return treeItem;
        } else if (element instanceof ModuleItem) {
            const treeItem = new vscode.TreeItem(element.name, vscode.TreeItemCollapsibleState.Expanded);
            treeItem.contextValue = 'module';
            treeItem.iconPath = new vscode.ThemeIcon('package');
            return treeItem;
        } else {
            // It's a Task
            const task = element as Task;
            const hasChildren = (task.subtasks && task.subtasks.length > 0) || this.store.getChildTasks(task.id).length > 0;

            const treeItem = new vscode.TreeItem(task.title,
                hasChildren
                    ? vscode.TreeItemCollapsibleState.Collapsed
                    : vscode.TreeItemCollapsibleState.None
            );

            const dateStr = task.created_at ? `${task.created_at.substring(0, 10)}` : '';
            treeItem.description = `${dateStr}`;
            treeItem.tooltip = `${task.title}\nStatus: ${task.status}\nCreated: ${task.created_at}\nID: ${task.id}`;
            treeItem.contextValue = 'task';
            treeItem.iconPath = this.getIcon(task.status);
            treeItem.command = {
                command: 'pog-task-manager.openTaskDetail',
                title: 'Open Task Detail',
                arguments: [task]
            };

            return treeItem;
        }
    }

    getChildren(element?: TreeElement): vscode.ProviderResult<TreeElement[]> {
        if (!element) {
            // Root -> Projects
            return this.store.getProjects().map(p => new ProjectItem(p));
        } else if (element instanceof ProjectItem) {
            // Project -> Modules
            return this.store.getModules(element.name).map(m => new ModuleItem(element.name, m));
        } else if (element instanceof ModuleItem) {
            // Module -> Root Tasks (no parent) inside this module
            const tasks = this.store.getTasks(element.project, element.name);
            return this.filterTasks(tasks);
        } else {
            // Task -> Subtasks
            const task = element as Task;
            const subtasks = this.store.getSubtasks(task.id);
            return this.filterTasks(subtasks);
        }
    }

    getParent(element: TreeElement): vscode.ProviderResult<TreeElement> {
        if (element instanceof ProjectItem) {
            return null; // Projects are at root level
        } else if (element instanceof ModuleItem) {
            return new ProjectItem(element.project);
        } else {
            // Task
            const task = element as Task;
            if (task.parent_task) {
                // Find parent task
                const allTasks = this.store.getAllTasks();
                const parentTask = allTasks.find(t => t.id === task.parent_task);
                return parentTask || null;
            } else {
                // Root task - find its module
                const projects = this.store.getProjects();
                for (const project of projects) {
                    const modules = this.store.getModules(project);
                    for (const module of modules) {
                        const tasks = this.store.getTasks(project, module);
                        if (tasks.find(t => t.id === task.id)) {
                            return new ModuleItem(project, module);
                        }
                    }
                }
                return null;
            }
        }
    }

    private filterTasks(tasks: Task[]): Task[] {
        if (this._statusFilter.size === 0) {
            return tasks;
        }
        
        // Filter tasks and include parents if any child passes the filter
        return tasks.filter(task => {
            // If task itself matches filter, include it
            if (this._statusFilter.has(task.status)) {
                return true;
            }
            
            // Check if any subtasks pass the filter
            const subtasks = this.store.getSubtasks(task.id);
            if (subtasks.length > 0) {
                // Recursively check subtasks
                const hasMatchingSubtask = this.hasMatchingDescendant(subtasks);
                return hasMatchingSubtask;
            }
            
            return false;
        });
    }
    
    private hasMatchingDescendant(tasks: Task[]): boolean {
        for (const task of tasks) {
            // Check if this task matches
            if (this._statusFilter.has(task.status)) {
                return true;
            }
            
            // Check descendants
            const subtasks = this.store.getSubtasks(task.id);
            if (subtasks.length > 0 && this.hasMatchingDescendant(subtasks)) {
                return true;
            }
        }
        
        return false;
    }

    private getIcon(status: string): vscode.ThemeIcon {
        switch (status) {
            case 'completed':
                return new vscode.ThemeIcon('pass', new vscode.ThemeColor('testing.iconPassed'));
            case 'in_progress':
                return new vscode.ThemeIcon('play', new vscode.ThemeColor('testing.iconQueued'));
            case 'pending':
                return new vscode.ThemeIcon('circle-outline');
            case 'in_design':
                return new vscode.ThemeIcon('pencil', new vscode.ThemeColor('charts.purple'));
            case 'in_planning':
                return new vscode.ThemeIcon('list-tree', new vscode.ThemeColor('charts.blue'));
            case 'blocked':
                return new vscode.ThemeIcon('error', new vscode.ThemeColor('testing.iconFailed'));
            case 'in_review':
                return new vscode.ThemeIcon('eye');
            case 'cancelled':
                return new vscode.ThemeIcon('circle-slash', new vscode.ThemeColor('descriptionForeground'));
            default:
                return new vscode.ThemeIcon('circle-outline');
        }
    }
}
