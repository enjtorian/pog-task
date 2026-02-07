import * as path from 'path';
import * as vscode from 'vscode';
import { TaskStore } from '../core/store';
import { Task } from '../core/types';

export async function copyExecutePrompt(store: TaskStore, task: Task) {
    let filename = 'unknown.jsonl';
    if (task._filePath) {
        filename = path.basename(task._filePath);
    }

    const prompt = `
---
# Step 1: Read Context
請閱讀以下文件及相關資源：
- pog-task/pog-task-agent-instructions.md
- pog-task/list/${filename}
- pog-task/list/record/${task.id}/record.md

# Step 2: Execute Task
請執行 pog-task/list/${filename} 中指定 Task：
- task id: ${task.id}

# Step 3: Update Progress
- 更新 status: in_progress → in_review
- 更新 checklist / notes / actual_hours
- 在 history 中加入執行紀錄
- 在 record.md 中記錄關鍵決策與產出物

---
    `.trim();

    await vscode.env.clipboard.writeText(prompt);
    vscode.window.showInformationMessage('Execute Prompt copied to clipboard!');
}

export async function copyTaskContext(task: Task) {
    const context = `
# Task: ${task.title}
- **ID**: ${task.id}
- **Status**: ${task.status}
- **Priority**: ${task.priority}
- **Description**:
${task.description}

- **Context Files**:
${(task.related_files || []).map(f => `- ${f}`).join('\n')}
    `;

    await vscode.env.clipboard.writeText(context.trim());
    vscode.window.showInformationMessage('Task context copied to clipboard!');
}

export async function copyCreatePrompt(task: Task) {
    const project = task._project || 'common';
    const module = task._module || 'improve';

    // Default to 'common' and 'improve' if unknown, but usually they are populated.
    // If they are 'Unknown Project', maybe prompt user? 
    // For now, let's just use what's in the task or fallback placeholders.

    const prompt = `
---
# Step 1: Read Context
請閱讀以下文件及相關資源：
- pog-task/pog-task-agent-instructions.md
- pog-task/declare.jsonl

# Step 2: Create or Join Task
請在 pog-task/list 下操作：
- project: {${project}}
- module: {${module}}
- 如果任務不存在 → 新建任務
- 如果任務已存在 → 加入該任務
- parent task id: {task.parent_task}

# Step 3: 理解任務 本次任務：
    xxxxxxxx

# Step 4: Generate Task Record
請生成 record.md 檔案（位於 pog-task/list/record/{task-uuid}/record.md），內容包含：
- Original Prompt
- Task 目標
- Execution Plan / Checklist
- 相關參考文件
---
    `.trim();

    await vscode.env.clipboard.writeText(prompt);
    vscode.window.showInformationMessage('Create Prompt copied to clipboard!');
}
