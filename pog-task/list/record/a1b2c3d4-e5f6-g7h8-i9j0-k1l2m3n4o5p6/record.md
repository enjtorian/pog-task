# Task Record: POG Task Manager 設計：Record.md 流程優化

## Original Prompt

```
優化 record.md 的閱讀 放在 Save 等等的 function 後面
```

## 設計規劃

### 2.7 Record.md 流程優化 (Record.md Workflow Optimization)

將 `record.md` 的撰寫與閱讀整合進任務生命週期，而非獨立的操作。

*   **Save 後自動提示**:
    *   當使用者在 Webview 編輯器按下 "Save" 且任務狀態變更為 `in_progress` 時，Toast 提示 "Access Record.md?" 或直接在 Webview 旁邊開啟 Preview。
*   **Webview 整合**:
    *   在 Task Detail Webview 底部增加 "Project Record" 區塊。
    *   提供 "Open Record.md" 按鈕，點擊後並排開啟 (Side-by-side)。
    *   若 `record.md` 不存在，按鈕顯示為 "Create Record.md" 並自動帶入 Template。
