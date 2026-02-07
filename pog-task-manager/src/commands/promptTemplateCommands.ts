import * as vscode from 'vscode';
import { PromptTemplateStore, PromptTemplate } from '../core/promptTemplateStore';

/**
 * Copy prompt template to clipboard
 */
export async function copyPromptTemplate(template: PromptTemplate, store: PromptTemplateStore): Promise<void> {
    const content = store.getTemplateContent(template.id);

    if (!content) {
        vscode.window.showErrorMessage(`Failed to read template: ${template.name}`);
        return;
    }

    await vscode.env.clipboard.writeText(content);
    vscode.window.showInformationMessage(`Copied prompt template: ${template.name}`);
}

/**
 * Preview prompt template in editor
 */
export async function previewPromptTemplate(template: PromptTemplate, store: PromptTemplateStore): Promise<void> {
    const content = store.getTemplateContent(template.id);

    if (!content) {
        vscode.window.showErrorMessage(`Failed to read template: ${template.name}`);
        return;
    }

    // Open in new editor
    const doc = await vscode.workspace.openTextDocument({
        content: content,
        language: 'markdown'
    });

    await vscode.window.showTextDocument(doc, {
        preview: true,
        viewColumn: vscode.ViewColumn.Beside
    });
}

/**
 * Open prompt template file
 */
export async function openPromptTemplateFile(template: PromptTemplate): Promise<void> {
    const uri = vscode.Uri.file(template.path);
    const doc = await vscode.workspace.openTextDocument(uri);
    await vscode.window.showTextDocument(doc);
}

/**
 * Insert prompt template with task context
 * Combines the template with current task information
 */
export async function insertPromptTemplateWithContext(
    template: PromptTemplate,
    store: PromptTemplateStore
): Promise<void> {
    const content = store.getTemplateContent(template.id);

    if (!content) {
        vscode.window.showErrorMessage(`Failed to read template: ${template.name}`);
        return;
    }

    // TODO: Future enhancement - combine with task context
    // For now, just copy the template
    await vscode.env.clipboard.writeText(content);
    vscode.window.showInformationMessage(`Copied prompt template with context: ${template.name}`);
}
