# Task Record: POG Task Manager v1.2 功能擴展與優化

## Original Prompt

```
# Step 1: Read Context
請閱讀以下文件及相關資源：
- pog-task/pog-task-agent-instructions.md
- pog-task/task.schema.json

# Step 2: Create or Join Task
請在 pog-task/list 下操作：
- project: {common}
- module: {improve}
- parent task id: {9d8f6c3a-2e1b-4f5a-8b3c-1d5e7f9a2b4c}

# Step 4: 理解任務 本次任務：
1. 在 initPogTask 增加 README.md, pog-task-design.md
2. 調整 pog task manager 的實作
   2.1 plugin 啟動偵測 pog-task 檔案，如果沒有則遮罩並提供 initPogTask 按鈕
   2.2 在 prompt templates view 提供 initPogTaskPrompt 功能，且同樣具備初始化後才顯示的遮版機制
   2.3 增加 Task Dashboard 頁面
   2.4 調整 copyCreatePrompt 預設建立 sub task
   2.5 調整 task.schema.json 與 pog-task-agent-instructions.md 新增 original_prompt
   2.6 quickAdd 不要建立 record.md，調整順序先選 project/module 再輸入 task name，建立後立即 refresh
   2.7 在 task list 上的 project/module 建立 + 按鈕
```

## Task 目標

對 pog-task-manager VSCode 擴充進行 v1.2 大幅度功能更新，涵蓋 8 個子項。

## Execution Plan / Checklist

1. [x] initPogTask 增加 README.md, pog-task-design.md
2. [x] Plugin 啟動偵測 + Welcome View
3. [x] initPogTaskPrompt (Prompt Templates view)
4. [x] Task Dashboard webview
5. [x] copyCreatePrompt 修正 parent_task
6. [x] Schema + Instructions 更新 original_prompt
7. [x] quickAdd 優化
8. [x] Task List project/module + 按鈕
9. [x] Verification: npm run compile — 通過

## 相關參考文件

- `pog-task/pog-task-agent-instructions.md` — Agent 操作指南
- `pog-task/task.schema.json` — 任務 Schema
- `pog-task-manager/AGENTS.md` — Plugin 開發指南
- `pog-task-manager/src/extension.ts` — 入口點
- `pog-task-manager/src/commands/` — 命令邏輯
- `pog-task-manager/src/core/` — 資料層
- `pog-task-manager/src/ui/` — UI 層

## Execution Log

### 2026-04-12: 完成全部實作

**修改檔案清單：**

| 檔案 | 變更類型 | 說明 |
|------|---------|------|
| `initPogTask.ts` | MODIFY | 新增 README.md + pog-task-design.md 下載 |
| `extension.ts` | MODIFY | 啟動偵測、Dashboard/initPogTaskPrompt/project+module commands |
| `package.json` | MODIFY | Welcome view、新 commands、menu entries、version → 1.2.0 |
| `initPogTaskPrompt.ts` | NEW | Code 驗證 + 從 URL 下載 prompt template |
| `taskDashboardPanel.ts` | NEW | Dashboard webview 統計頁面 |
| `agentCommands.ts` | MODIFY | copyCreatePrompt 修正 + project/module level functions |
| `quickAdd.ts` | MODIFY | 流程重排、移除 record.md 建立、auto refresh |
| `types.ts` | MODIFY | Task interface 新增 original_prompt |
| `task.schema.json` | MODIFY | 新增 original_prompt 欄位 |
| `pog-task-agent-instructions.md` | MODIFY | 核心欄位範例新增 original_prompt |
| `record.md` | MODIFY | 更新執行紀錄與決策 |
| `package.json` | MODIFY | 修正 Prompt Templates 視圖的顯示條件（遮版） |

**關鍵決策：**
- Welcome View 使用 VS Code 原生 `viewsWelcome` API，當偵測不到 `pog-task-agent-instructions.md` 和 `task.schema.json` 時顯示。
- 除了 Task List，也將 Prompt Templates 視圖加入遮蔽邏輯，確保一致的初始化引導體驗。
- Dashboard 使用 Webview Panel 實作，顯示 status/priority/project 三維統計。
- initPogTaskPrompt 使用 hardcoded code `pog-prompt-2026` 進行驗證。
- quickAdd 改為 project → module → task name 順序，移除 record.md 自動建立。
