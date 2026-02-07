# Task Record: POG Task Manager Plugin 優化：Agent Prompt 區分 Create 與 Execute

## 需求
將原有的 "Assign to Agent" 功能移除，調整為 "Execute" 功能，生成執行任務用的 Prompt。
同時保留原有的 "Create Agent Prompt" 功能，並重新命名為 "Create Prompt"。

## Execution Details
- **Created Task**: `j9a0b1c2-d3e4-4f5a-6b7c-8d9e0f1g2h3i`
- **Refactoring**:
    - **`src/commands/agentCommands.ts`**:
        - Renamed `assignTaskToAgent` -> `copyExecutePrompt`.
        - Implemented new Prompt format for Execute:
            ```
            ---
            閱讀
                pog-task/pog-task-agent-instructions.md 與其相關的檔案
            執行 {filename} 中的 Task : {uuid}
            ---
            ```
        - Renamed `copyAgentPrompt` -> `copyCreatePrompt`.
    - **`src/extension.ts`**:
        - Updated imports and command registrations.
        - `pog-task-manager.assignAgent` -> `pog-task-manager.copyExecutePrompt`
        - `pog-task-manager.copyAgentPrompt` -> `pog-task-manager.copyCreatePrompt`
    - **`package.json`**:
        - Updated commands and menu contributions.
        - "Assign to Agent" (Inline) -> "Copy Execute Prompt" (Inline)
        - "Copy Agent Prompt" (Menu) -> "Copy Create Prompt" (Menu)
    - **`src/ui/taskWebviewPanel.ts`**:
        - Replaced "Copy Agent Prompt" button with two buttons: "Copy Execute Prompt" and "Copy Create Prompt".
        - Updated message handling logic.

## Verification
- `npm run compile` passed.
- **Manual Check**:
    - **Tree View**:
        - Inline action should show "Copy Execute Prompt" (Play icon).
        - Context menu should show "Copy Create Prompt".
    - **Webview**:
        - Should show two buttons: "Copy Execute Prompt" and "Copy Create Prompt".
    - **Clipboard Content**:
        - Execute Prompt should match the requested format with `filename` and `task.id`.
        - Create Prompt should contain `pog-task/list` path with `project` and `module` placeholders.

## Artifacts
- `src/commands/agentCommands.ts`
- `src/extension.ts`
- `package.json`
- `src/ui/taskWebviewPanel.ts`
