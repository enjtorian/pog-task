import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Represents a Prompt Template
 */
export interface PromptTemplate {
    /** Unique identifier (file path relative to prompts directory) */
    id: string;
    /** Display name (filename without extension) */
    name: string;
    /** Full file path */
    path: string;
    /** Category (folder name or derived from filename prefix) */
    category: string;
    /** File content */
    content?: string;
}

/**
 * Store for managing Prompt Templates
 */
export class PromptTemplateStore {
    private templates: PromptTemplate[] = [];
    private promptDirectory: string;
    private workspaceRoot: string;

    constructor() {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            throw new Error('No workspace folder found');
        }
        this.workspaceRoot = workspaceFolders[0].uri.fsPath;

        // Get prompt directory from configuration
        const config = vscode.workspace.getConfiguration('pog.taskManager');
        const configPath = config.get<string>('promptTemplateDirectory', './.github/prompts');
        this.promptDirectory = path.join(this.workspaceRoot, configPath);
    }

    /**
     * Load all prompt templates from the directory
     */
    public load(): void {
        this.templates = [];

        if (!fs.existsSync(this.promptDirectory)) {
            console.warn(`Prompt template directory not found: ${this.promptDirectory}`);
            return;
        }

        this.scanDirectory(this.promptDirectory, '');
        console.log(`Loaded ${this.templates.length} prompt templates`);
    }

    /**
     * Recursively scan directory for prompt files
     */
    private scanDirectory(dir: string, categoryPath: string): void {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                // Recursively scan subdirectories
                const newCategoryPath = categoryPath ? `${categoryPath}/${entry.name}` : entry.name;
                this.scanDirectory(fullPath, newCategoryPath);
            } else if (entry.isFile() && this.isPromptFile(entry.name)) {
                // Add prompt template
                const category = categoryPath || 'Uncategorized';
                const relativePath = path.relative(this.promptDirectory, fullPath);

                this.templates.push({
                    id: relativePath,
                    name: this.getDisplayName(entry.name),
                    path: fullPath,
                    category: category
                });
            }
        }
    }

    /**
     * Check if file is a prompt template
     */
    private isPromptFile(filename: string): boolean {
        return filename.endsWith('.prompt.md') || filename.endsWith('.md');
    }

    /**
     * Get display name from filename
     */
    private getDisplayName(filename: string): string {
        return filename.replace(/\.prompt\.md$/, '').replace(/\.md$/, '');
    }

    /**
     * Get all templates
     */
    public getTemplates(): PromptTemplate[] {
        return this.templates;
    }

    /**
     * Get templates grouped by category
     */
    public getTemplatesByCategory(): Map<string, PromptTemplate[]> {
        const grouped = new Map<string, PromptTemplate[]>();

        for (const template of this.templates) {
            const category = template.category;
            if (!grouped.has(category)) {
                grouped.set(category, []);
            }
            grouped.get(category)!.push(template);
        }

        return grouped;
    }

    /**
     * Get template content by ID
     */
    public getTemplateContent(templateId: string): string | null {
        const template = this.templates.find(t => t.id === templateId);
        if (!template) {
            return null;
        }

        try {
            return fs.readFileSync(template.path, 'utf-8');
        } catch (error) {
            console.error(`Failed to read template: ${template.path}`, error);
            return null;
        }
    }

    /**
     * Get template by ID
     */
    public getTemplate(templateId: string): PromptTemplate | undefined {
        return this.templates.find(t => t.id === templateId);
    }
}
