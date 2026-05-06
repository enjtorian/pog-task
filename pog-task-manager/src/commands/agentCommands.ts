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
- 更新 status: in_progress
- 更新 checklist / notes / actual_hours
- 在 history 中加入執行紀錄
- 在 record.md 中記錄關鍵決策與產出物 把 implementation plan 的內容也記錄下來
- 每做到一個段落 就透過 git commit 的方式提交一次，commit message 概述該段落的內容

# Step 3: Execute Task
請執行 pog-task/list/${project}/${module}/${filename} 中指定 Task：
- task id: ${task.id}

# Step 4: Update Progress
- 更新 status: in_progress → in_review
- 更新 checklist / notes / actual_hours
- 在 history 中加入執行紀錄
- 在 record.md 中記錄關鍵決策與產出物 把 walkthrough 的內容也記錄下來
- 重要 在未建立 新的 task 時，後續修改的提示與實現，從 Step 2 開始繼續實現
---
    `.trim();

    await vscode.env.clipboard.writeText(prompt);
    vscode.window.showInformationMessage('Execute Task copied to clipboard!');
}

export async function copyAnalyzePrompt(store: TaskStore, task: Task) {
    let filename = 'unknown.yaml';
    const project = task._project || 'alpha';
    const module = task._module || 'activate';

    if (task._filePath) {
        filename = path.basename(task._filePath);
    }

    const issueLine = task.issue ? `- issue: ${task.issue}\n` : '';

    const prompt = `
---
# Step 1: Read Context
請閱讀以下文件及相關資源：
- pog-task/pog-task-agent-instructions.md
- pog-task/list/${project}/${module}/${filename}
- pog-task/list/${project}/${module}/record/${task.id}/record.md

# Step 2: 分析任務
請針對下列 task 進行分析：
- task id: ${task.id}
${issueLine}
請輸出：
1. 任務目標與成功定義
2. 影響範圍 / 需要動到的模組
3. Implementation Plan (步驟、風險、預估時數)
4. 驗證計畫 (測試 / 手動驗證 / 邊界情況)

並把分析結果寫入：
- pog-task/list/${project}/${module}/record/${task.id}/record.md

# Step 3: 更新狀態
- 把 status 從 ${task.status} → in_planning
- 在 history 中加入一筆 progress：分析完成、產出 implementation plan
- 更新 checklist / notes 反映分析結果

⚠️ 重要：分析完成後請務必把 status 改為 in_planning，這是一個信號讓後續執行流程能接手。

# Step 4: Hand-off
分析完成後可以直接複製 task 的「複製執行提示」按鈕產出的 prompt，進入下一階段。
---
    `.trim();

    await vscode.env.clipboard.writeText(prompt);
    vscode.window.showInformationMessage('Analyze Task prompt copied — 分析完請把 status 改為 in_planning');
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
- parent task id: {${task.id}}

# Step 3: Generate Task Record
請生成 record.md 檔案（位於 pog-task/list/${project}/${module}/record/{task-uuid}/record.md），內容包含：
- Original Prompt
- Task 目標
- Execution Plan / Checklist
- 相關參考文件
- implementation plan 的內容也記錄下來
- 每做到一個段落 就透過 git commit 的方式提交一次，commit message 概述該段落的內容

# Step 4: 理解任務 本次任務：
    xxxxxxxx

# Step 5: Update Progress
- 更新 status: in_progress → in_review
- 更新 checklist / notes / actual_hours
- 在 history 中加入執行紀錄
- 在 record.md 中記錄關鍵決策與產出物 把 walkthrough 的內容也記錄下來
- 重要 在未建立 新的 task 時，後續修改的提示與實現，從 Step 2 開始繼續實現

---
    `.trim();

    await vscode.env.clipboard.writeText(prompt);
    vscode.window.showInformationMessage('Create Task copied to clipboard!');
}

export async function copyCreatePromptForProject(store: TaskStore, projectName: string) {
    // 1. Select or Enter Module
    const modules = store.getModules(projectName);
    const createNewModuleItem = '$(plus) Create New Module...';
    const moduleItems = [createNewModuleItem, ...modules];

    let module = await vscode.window.showQuickPick(moduleItems, {
        placeHolder: `Select Module for project "${projectName}"`
    });

    if (!module) { return; }

    if (module === createNewModuleItem) {
        module = await vscode.window.showInputBox({
            prompt: 'Enter New Module Name',
            placeHolder: 'e.g., core'
        });
        if (!module) { return; }
    }

    const prompt = buildCreatePromptTemplate(projectName, module, null);
    await vscode.env.clipboard.writeText(prompt);
    vscode.window.showInformationMessage('Create Task copied to clipboard!');
}

export async function copyCreatePromptForModule(projectName: string, moduleName: string) {
    const prompt = buildCreatePromptTemplate(projectName, moduleName, null);
    await vscode.env.clipboard.writeText(prompt);
    vscode.window.showInformationMessage('Create Task copied to clipboard!');
}

function buildCreatePromptTemplate(project: string, module: string, parentTaskId: string | null): string {
    const parentLine = parentTaskId
        ? `- parent task id: {${parentTaskId}}`
        : `- parent task id: {none}`;

    return `
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
${parentLine}

# Step 3: Generate Task Record
請生成 record.md 檔案（位於 pog-task/list/${project}/${module}/record/{task-uuid}/record.md），內容包含：
- Original Prompt
- Task 目標
- Execution Plan / Checklist
- 相關參考文件
- implementation plan 的內容也記錄下來
- 每做到一個段落 就透過 git commit 的方式提交一次，commit message 概述該段落的內容

# Step 4: 理解任務 本次任務：
    xxxxxxxx

# Step 5: Update Progress
- 更新 status: in_progress → in_review
- 更新 checklist / notes / actual_hours
- 在 history 中加入執行紀錄
- 在 record.md 中記錄關鍵決策與產出物 把 walkthrough 的內容也記錄下來
- 重要 在未建立 新的 task 時，後續修改的提示與實現，從 Step 2 開始繼續實現

---
    `.trim();
}
