# Record: POG Task Manager 優化：createPromptForProject 增加 module 詢問

## Original Prompt
調整 在 點擊 project inline 的 createPromptForProject 如同 Quick Add Task 一樣 要額外詢問 module

## Task 目標
在點擊專案列表中的 `createPromptForProject` 按鈕時，除了目前的流程外，應比照 `Quick Add Task` 流程，額外詢問使用者要將任務建立在在哪個 `module` 下。

## Execution Plan / Checklist
- [ ] 研究 `createPromptForProject` 指令實作
- [ ] 修改指令流程以加入 `module` 詢問
- [ ] 驗證功能是否正常運作

## 相關參考文件
- `pog-task-manager/src/extension.ts`
- `pog-task-manager/src/commands/agentCommands.ts`
- `pog-task-manager/src/commands/quickAdd.ts` (參考其詢問 module 的實作)

## 執行紀錄
- 2026-04-13: 建立任務 YAML 與 record.md
- 2026-04-13: 實作優化內容
    - 修改 `agentCommands.ts`：更新 `copyCreatePromptForProject` 函式，加入 module 選擇流程（QuickPick 與 InputBox）。
    - 修改 `extension.ts`：更新 `pog-task-manager.createPromptForProject` 指令註冊，將 `store` 實例傳入。
    - 通過 `npm run compile` 編譯驗證。

## Implementation Plan
已於 [implementation_plan.md](file:///Users/ted/.gemini/antigravity/brain/abe6bc9e-a2de-473a-9683-82f69fd163a3/implementation_plan.md) 中定義並獲得批准。

## Walkthrough
本次更動主要在 `copyCreatePromptForProject` 中整合了與 `quickAdd` 相同的 module 選擇邏輯。使用者現在點擊專案旁的建立 Prompt 按鈕時，會被詢問要將任務歸類在哪個 module 下，使生成的 Prompt 內容更為精確，減少手動修改佔位符的需求。
