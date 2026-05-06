import * as vscode from 'vscode';
import { TaskStore } from '../core/store';
import { Task } from '../core/types';
import { ModuleItem, ProjectItem } from './taskTreeDataProvider';

type TreeElement = ProjectItem | ModuleItem | Task;

export class IssueTaskTreeDataProvider implements vscode.TreeDataProvider<TreeElement> {
    private _onDidChangeTreeData: vscode.EventEmitter<TreeElement | undefined | null | void> =
        new vscode.EventEmitter<TreeElement | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<TreeElement | undefined | null | void> =
        this._onDidChangeTreeData.event;

    constructor(private store: TaskStore) {
        this.store.onDidUpdate(() => this.refresh());
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: TreeElement): vscode.TreeItem {
        if (element instanceof ProjectItem) {
            const item = new vscode.TreeItem(element.name, vscode.TreeItemCollapsibleState.Expanded);
            item.contextValue = 'issueProject';
            item.iconPath = new vscode.ThemeIcon('project');
            return item;
        }
        if (element instanceof ModuleItem) {
            const item = new vscode.TreeItem(element.name, vscode.TreeItemCollapsibleState.Expanded);
            item.contextValue = 'issueModule';
            item.iconPath = new vscode.ThemeIcon('package');
            return item;
        }

        const task = element as Task;
        const subtasks = this.store.getSubtasks(task.id).filter(t => this.subtreeHasIssue(t));
        const collapsibleState = subtasks.length > 0
            ? vscode.TreeItemCollapsibleState.Collapsed
            : vscode.TreeItemCollapsibleState.None;

        const issueKey = (task.issue || '').trim();
        const label = issueKey ? `[${issueKey}] ${task.title}` : task.title;
        const item = new vscode.TreeItem(label, collapsibleState);
        item.description = task.created_at ? task.created_at.substring(0, 10) : '';
        item.tooltip = [
            `${task.title}`,
            `Issue: ${issueKey || '(none — descendant has issue)'}`,
            `Status: ${task.status}`,
            `Created: ${task.created_at ?? ''}`,
            `ID: ${task.id}`,
        ].join('\n');
        const issueKeyForCtx = (task.issue || '').trim();
        item.contextValue = issueKeyForCtx ? 'issueTask' : 'issueTaskParent';
        item.iconPath = this.getIcon(task.status);
        item.command = {
            command: 'pog-task-manager.openTaskDetail',
            title: 'Open Task Detail',
            arguments: [task],
        };
        return item;
    }

    getChildren(element?: TreeElement): vscode.ProviderResult<TreeElement[]> {
        if (!element) {
            return this.store.getProjects()
                .filter(p => this.projectHasIssue(p))
                .map(p => new ProjectItem(p));
        }
        if (element instanceof ProjectItem) {
            return this.store.getModules(element.name)
                .filter(m => this.moduleHasIssue(element.name, m))
                .map(m => new ModuleItem(element.name, m));
        }
        if (element instanceof ModuleItem) {
            return this.store.getTasks(element.project, element.name)
                .filter(t => this.subtreeHasIssue(t));
        }
        const task = element as Task;
        return this.store.getSubtasks(task.id).filter(t => this.subtreeHasIssue(t));
    }

    getParent(element: TreeElement): vscode.ProviderResult<TreeElement> {
        if (element instanceof ProjectItem) {
            return null;
        }
        if (element instanceof ModuleItem) {
            return new ProjectItem(element.project);
        }
        const task = element as Task;
        if (task.parent_task) {
            return this.store.getTask(task.parent_task) ?? null;
        }
        if (task._project && task._module) {
            return new ModuleItem(task._project, task._module);
        }
        return null;
    }

    private hasIssue(task: Task): boolean {
        return typeof task.issue === 'string' && task.issue.trim().length > 0;
    }

    private subtreeHasIssue(task: Task): boolean {
        if (this.hasIssue(task)) {
            return true;
        }
        for (const child of this.store.getSubtasks(task.id)) {
            if (this.subtreeHasIssue(child)) {
                return true;
            }
        }
        return false;
    }

    private moduleHasIssue(project: string, module: string): boolean {
        return this.store.getTasks(project, module).some(t => this.subtreeHasIssue(t));
    }

    private projectHasIssue(project: string): boolean {
        return this.store.getModules(project).some(m => this.moduleHasIssue(project, m));
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
