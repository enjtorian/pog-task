# Task Record: POG Task Manager Plugin 實作：Agent Prompt 生成按鈕

## Prompt
> 加入一顆 按鈕 可以產生： 以下的 prompt : ... (Agent Guide Prompt Template)

## Execution Details
- Implemented `copyAgentPrompt` in `src/commands/agentCommands.ts`:
    - Generates a prompt string inserting `task._project` and `task._module`.
    - Copies the string to system clipboard.
- Registered command `pog-task-manager.copyAgentPrompt` in `src/extension.ts` and `package.json`.
    - Added to `view/item/context` menu for Task Tree View.
- Updated `src/ui/taskWebviewPanel.ts`:
    - Added "Copy Agent Prompt" button next to "Save".
    - Handled `copyAgentPrompt` message from Webview to execute the command.

## Verification
- `npm run compile` passed.
- Manual verification:
    - **Tree View**: Right-click a task -> Select "Copy Agent Prompt". Clipboard should contain the formatted prompt.
    - **Webview**: Open a task -> Click "Copy Agent Prompt" button. Clipboard should contain the formatted prompt.

## Artifacts
- `src/commands/agentCommands.ts` (updated)
- `src/extension.ts` (updated)
- `src/ui/taskWebviewPanel.ts` (updated)
- `package.json` (updated)
