import * as vscode from 'vscode';
import { PromptTemplateStore, PromptTemplate } from '../core/promptTemplateStore';

/**
 * Tree item for Prompt Templates
 */
class PromptTemplateTreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly template?: PromptTemplate,
        public readonly category?: string
    ) {
        super(label, collapsibleState);

        if (template) {
            this.contextValue = 'promptTemplate';
            this.command = {
                command: 'pog-task-manager.previewPromptTemplate',
                title: 'Preview Prompt Template',
                arguments: [template]
            };
            this.iconPath = new vscode.ThemeIcon('file-text');
            this.tooltip = template.path;
        } else if (category) {
            this.contextValue = 'promptCategory';
            this.iconPath = new vscode.ThemeIcon('folder');
        }
    }
}

/**
 * TreeDataProvider for Prompt Templates
 */
export class PromptTemplateTreeDataProvider implements vscode.TreeDataProvider<PromptTemplateTreeItem> {
    private _onDidChangeTreeData = new vscode.EventEmitter<PromptTemplateTreeItem | undefined | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    constructor(private store: PromptTemplateStore) {
        // Initial load
        this.store.load();
    }

    /**
     * Refresh the tree view
     */
    refresh(): void {
        this.store.load();
        this._onDidChangeTreeData.fire();
    }

    /**
     * Get tree item
     */
    getTreeItem(element: PromptTemplateTreeItem): vscode.TreeItem {
        return element;
    }

    /**
     * Get children of a tree item
     */
    getChildren(element?: PromptTemplateTreeItem): Thenable<PromptTemplateTreeItem[]> {
        if (!element) {
            // Root level: return categories
            return Promise.resolve(this.getCategoryItems());
        } else if (element.category) {
            // Category level: return templates in this category
            return Promise.resolve(this.getTemplateItems(element.category));
        }

        return Promise.resolve([]);
    }

    /**
     * Get category tree items
     */
    private getCategoryItems(): PromptTemplateTreeItem[] {
        const grouped = this.store.getTemplatesByCategory();
        const categories: PromptTemplateTreeItem[] = [];

        for (const [category, templates] of grouped) {
            const item = new PromptTemplateTreeItem(
                `${category} (${templates.length})`,
                vscode.TreeItemCollapsibleState.Collapsed,
                undefined,
                category
            );
            categories.push(item);
        }

        return categories.sort((a, b) => a.label.localeCompare(b.label));
    }

    /**
     * Get template tree items for a category
     */
    private getTemplateItems(category: string): PromptTemplateTreeItem[] {
        const grouped = this.store.getTemplatesByCategory();
        const templates = grouped.get(category) || [];

        return templates.map(template => {
            return new PromptTemplateTreeItem(
                template.name,
                vscode.TreeItemCollapsibleState.None,
                template
            );
        }).sort((a, b) => a.label.localeCompare(b.label));
    }
}
