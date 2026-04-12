# Task Record: POG Task Manager Plugin 優化：Copy Context 按鈕與 Prompt Template 整合

## Original Prompt
```text
# Step 4: 理解任務 本次任務：
1.1 調整 copy task context 改成 inline 的按鈕 $(copy)

2.1 調整 prompt tempaltes list 點擊 tree 開啟 目標 prompt 檔案 view
2.2 copyPromptTemplate 的 複製 內容 調整成 建立一個 copyCreatePrompt 然後把 目標 的 prompt tempalte 的檔案名稱 帶入 "# Step 4: 理解任務 本次任務："
```

## Task 目標
1.  優化 Task Detail Webview 的使用者體驗，將 "Copy Task Context" 從普通按鈕改為行內的小型圖示按鈕 `$(copy)`。
2.  增強 Prompt Templates 視圖的互動性，讓點擊 Tree Item 能直接在編輯器中開啟對應的 Prompt 範本檔案。
3.  調整 `copyPromptTemplate` 邏輯，改名為 `copyCreatePrompt`（或對應功能），並在複製內容時自動將範本檔名帶入特定格式的文字中。

## Execution Plan / Checklist
- [ ] 1.1 調整 copy task context 改成 inline 的按鈕 $(copy)
    - [ ] 研究 Webview 原始碼，找到 "Copy Task Context" 按鈕的位置。
    - [ ] 修改 HTML/CSS，將按鈕改為行內圖示風格。
- [ ] 2.1 點擊 Prompt Tree 開啟檔案
    - [ ] 研究 `PromptTreeDataProvider` 或相關 TreeView 實作。
    - [ ] 為 Tree Item 加入 `command` 屬性，當點擊時執行開啟檔案的動作。
- [ ] 2.2 調整 copyPromptTemplate 功能
    - [ ] 找到 `copyPromptTemplate` 命令的實作。
    - [ ] 調整其複製的內容，包含 "# Step 4: 理解任務 本次任務：" 與目標檔名。
- [ ] 5.1 更新 Progress 與 Record
    - [ ] 更新 YAML 狀態。
    - [ ] 在 `record.md` 記錄執行細節。

## 更新 Progress
- 更新 status: in_progress → in_review
- 更新 checklist / notes / actual_hours
- 在 history 中加入執行紀錄

## 實作細節與關鍵決策
### 1.1 Webview 介面調整
- 在 `taskWebviewPanel.ts` 的標題區域加入了行內圖示按鈕 `$(copy)`。
- **關鍵決策**：為了保持一致，使用了 VS Code 原生的 `codicon` 類別，雖然在 Webview 中可能需要額外 CSS 渲染，但在此環境下採用文字圖示風格作為 `$(copy)` 的呈現方式。
- 增加了 `copy-icon` CSS 類別，提供 hover 效果與適當間距。

### 2.1 Prompt Tree 點擊行為
- 修改 `PromptTemplateTreeItem` 的 `command`，從 `previewPromptTemplate` (預覽) 改為 `openPromptTemplateFile` (開啟實體檔案)。
- 這讓使用者可以更快速地編輯範本原始檔案。

### 2.2 Prompt 複製邏輯
- 重寫了 `copyPromptTemplate` 函數。
- **變更**：不再複製範本內容，而是生成一個符合 `Create Task` 結構的 Prompt 模板。
- **自動化**：自動提取範本檔名並帶入 `Step 4: 理解任務 本次任務：` 區塊中。

## 產出物
- 修改檔案：
    - `pog-task-manager/src/ui/taskWebviewPanel.ts`
    - `pog-task-manager/src/ui/promptTemplateTreeView.ts`
    - `pog-task-manager/src/commands/promptTemplateCommands.ts`

## 驗證結果
- [x] Webview 中的 `$(copy)` 按鈕可正確觸發 `pog-task-manager.copyContext` 命令。
- [x] 點擊 Prompt Tree Item 可直接於編輯器開啟檔案。
- [x] 複製 Prompt Template 時，剪貼簿內容已更新為 Create Task 格式且包含正確檔名。
