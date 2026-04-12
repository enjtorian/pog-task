import * as vscode from 'vscode';
import * as path from 'path';
import { PromptTemplateStore, PromptTemplate } from '../core/promptTemplateStore';

/**
 * Copy prompt template to clipboard
 */
export async function copyPromptTemplate(template: PromptTemplate, store: PromptTemplateStore): Promise<void> {
    const filename = path.basename(template.path);

    const prompt = `
---
# Step 1: Read Context
請閱讀以下文件及相關資源：
- pog-task/pog-task-agent-instructions.md
- pog-task/task.schema.json

# Step 2: Create or Join Task
請在 pog-task/list 下操作：
- project: {common}
- module: {improve}
- 如果任務不存在 → 新建任務 (立即建立一個新的 yaml 檔案)
- 如果任務已存在 → 加入該任務 (直接修改 yaml 檔案)
- parent task id: {none}

# Step 3: Generate Task Record
請生成 record.md 檔案（位於 pog-task/list/common/improve/record/{task-uuid}/record.md），內容包含：
- Original Prompt
- Task 目標
- Execution Plan / Checklist
- 相關參考文件
- implementation plan 的內容也記錄下來
- 每做到一個段落 就透過 git commit 的方式提交一次，commit message 概述該段落的內容

# Step 4: 理解任務 本次任務：
${filename}

# Step 5: Update Progress
- 更新 status: in_progress → in_review
- 更新 checklist / notes / actual_hours
- 在 history 中加入執行紀錄
- 在 record.md 中記錄關鍵決策與產出物 把 walkthrough 的內容也記錄下來

---
    `.trim();

    await vscode.env.clipboard.writeText(prompt);
    vscode.window.showInformationMessage(`Copied Create Task prompt with template: ${template.name}`);
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
