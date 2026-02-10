import * as path from 'path';
import * as vscode from 'vscode';
import { TaskStore } from '../core/store';
import { Task } from '../core/types';

export async function copyExecutePrompt(store: TaskStore, task: Task) {
    let filename = 'unknown.yaml';
    const project = task._project || 'alpha';
    const module = task._module || 'activate';

    if (task._filePath) {
        filename = path.basename(task._filePath);
    }

    const prompt = `
---
# Step 1: Read Context
請閱讀以下文件及相關資源：
- pog-task/pog-task-agent-instructions.md
- pog-task/list/${project}/${module}/${filename}
- pog-task/list/${project}/${module}/record/${task.id}/record.md

# Step 2: Update Progress
- 更新 status: in_progress → in_review
- 更新 checklist / notes / actual_hours
- 在 history 中加入執行紀錄
- 在 record.md 中記錄關鍵決策與產出物
- 每做到一個段落 就透過 git commit 的方式提交一次，commit message 概述該段落的內容

# Step 3: Execute Task
請執行 pog-task/list/${project}/${module}/${filename} 中指定 Task：
- task id: ${task.id}

---
    `.trim();

    await vscode.env.clipboard.writeText(prompt);
    vscode.window.showInformationMessage('Execute Prompt copied to clipboard!');
}

export async function copyTaskContext(task: Task) {
    let filename = 'unknown.yaml';
    if (task._filePath) {
        filename = path.basename(task._filePath);
    }

    const context = `
# Task: ${task.title}
- **ID**: ${task.id}
- **File**: ${filename}
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
    const project = task._project || 'alpha';
    const module = task._module || 'activate';

    // Default to 'alpha' and 'activate' if unknown, but usually they are populated.
    // If they are 'Unknown Project', maybe prompt user? 
    // For now, let's just use what's in the task or fallback placeholders.

    const prompt = `
---
# Step 1: Read Context
請閱讀以下文件及相關資源：
- pog-task/pog-task-agent-instructions.md
- pog-task/task.schema.json

# Step 2: Create or Join Task
請在 pog-task/list 下操作：
- project: {${project}}
- module: {${module}}
- 如果任務不存在 → 新建任務 (立即建立一個新的 yaml 檔案)
- 如果任務已存在 → 加入該任務 (直接修改 yaml 檔案)
- parent task id: {task.parent_task}

# Step 3: Generate Task Record
請生成 record.md 檔案（位於 pog-task/list/${project}/${module}/record/{task-uuid}/record.md），內容包含：
- Original Prompt
- Task 目標
- Execution Plan / Checklist
- 相關參考文件
- 每做到一個段落 就透過 git commit 的方式提交一次，commit message 概述該段落的內容

# Step 4: 理解任務 本次任務：
    xxxxxxxx

# Step 5: Update Progress
- 更新 status: in_progress → in_review
- 更新 checklist / notes / actual_hours
- 在 history 中加入執行紀錄
- 在 record.md 中記錄關鍵決策與產出物

---
    `.trim();

    await vscode.env.clipboard.writeText(prompt);
    vscode.window.showInformationMessage('Create Prompt copied to clipboard!');
}
