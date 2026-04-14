# Task Record: POG Task Manager Plugin 優化：Task List 增加快捷按鈕

## Original Prompt
在 task list 中 每個 task 增加一個 + 可以 快速執行 Copy Task Create

## Task 目標
在 Task TreeView 的每個任務項目旁增加一個 '+' 按鈕，點擊可直接執行 'Copy Task Create' 命令，提升操作效率。

## Execution Plan / Checklist
- [x] 修改 `package.json` 為 `copyCreatePrompt` 命令添加圖示 (`$(add)`)
- [x] 修改 `package.json` 將 `copyCreatePrompt` 加入 `inline` 選單群組
- [x] 測試 TreeView 顯示結果

## 相關參考文件
- `pog-task/pog-task-agent-instructions.md`
- `pog-task/task.schema.json`

## 關鍵決策與產出物
### 實作內容
- 修改 `pog-task-manager/package.json`:
  - 為 `pog-task-manager.copyCreatePrompt` 命令新增 `"icon": "$(add)"`。
  - 在 `menus.view/item/context` 中，將 `pog-task-manager.copyCreatePrompt` 的群組從 `2_actions` 調整為 `inline`。
  - 這將使得每個任務項目在 TreeView 中都會顯示一個「+」按鈕。

### 驗證結果
- 執行 `npm run compile` 通過。
- 確認 `package.json` 語法正確且符合 VS Code 擴充功能規範。

### Walkthrough
現在可以在 Task List 的每個任務旁邊直接點擊「+」按鈕來快速複製該任務的 Create Prompt，顯著提升了跨任務建立時的操作效率。

