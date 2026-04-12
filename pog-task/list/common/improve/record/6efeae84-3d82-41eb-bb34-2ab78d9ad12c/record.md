# Task Record: POG Task Manager Plugin 優化：Task Detail 顯示 Original Prompt

## Original Prompt
本次任務：
1.1 在 TaskWebviewPanel 顯示 original_prompt

## Task 目標
在 Task Webview Detail 面板中顯示任務的 `original_prompt` 內容，方便使用者查看任務來源情境。

## Execution Plan / Checklist
- [x] 修改 `TaskWebviewPanel.ts` 注入 `original_prompt` 數據
- [x] 修改 `taskWebview.html/js` 顯示 `original_prompt` 區塊
- [x] 測試 Webview 顯示結果

## 相關參考文件
- `pog-task/pog-task-agent-instructions.md`
- `pog-task/task.schema.json`

## 關鍵決策與產出物
### 實作內容
- 修改 `pog-task-manager/src/ui/taskWebviewPanel.ts`:
  - 在 `_getHtmlForWebview` 方法中，於 `Priority` 區塊下方新增 `Original Prompt` 顯示區域。
  - 使用 `this.escapeHtml()` 對 `task.original_prompt` 進行轉義，防止 XSS 攻擊。
  - 樣式採用 `var(--vscode-textBlockQuote-background)` 背景，並加入位移邊框與捲軸處理（`max-height: 200px`）。

### 驗證結果
- 執行 `npm run compile` 通過，無編譯錯誤。
- 確認 Webview HTML 結構正確，且能夠安全顯示包含特殊字元的 Prompt 內容。

### Walkthrough
已在 Task Detail Webview 中成功整合 `Original Prompt` 欄位。這使得開發者能更直觀地追溯任務的原始需求，而無需手動打開 YAML 或 record.md 查看。

