# Task Record: 設計 POG Task Manager Plugin 任務管理功能

## Original Prompt

```
閱讀
    pog-task/pog-task-agent-instructions.md 與其相關的檔案
建立一個 common-improve-task.jsonl 下的任務
    設計 在 vscode 中 可以 透過 vscode plugin 讓使用者方便的檢視
    pog-task/list 中的 任務
    幫我思考 在 這個 plugin 中 有哪些 方便用者 使用的 功能
    ex : 快速在某個 project module 中加入任務
    ex : 如同 explorer 一樣 一層一層展開
        然後還可以 依照 priority、status 等等欄位篩選
    想要執行某個任務 可以 分派給 llm agent
    把思考的 設計 紀錄在 record.md 提供使用者檢視 
```

## 1. 核心目標

設計一個 VS Code Extension，旨在深度整合 `pog-task/list` 系統，提供使用者一個圖形化、直覺且高效的介面來管理專案任務。核心價值在於連結「開發者」與「LLM Agents」，讓任務的創建、檢視、分派與追蹤變得無縫。

## 2. 功能設計思考

### 2.1 任務檢視器 (Task Explorer View)

如同 VS Code 的檔案總管，提供一個專屬的 Side Bar View。

*   **層級結構 (Hierarchy)**:
    *   **Root**: 專案 (Project) -> 模組 (Module) -> JSONL 檔案
    *   **Task Node**: 顯示任務標題、狀態圖示 (Pending/In Progress/Completed)、優先級顏色。
    *   **parent_task**: 支援無限層級展開子任務 (根據 `parent_task` 關係)。
*   **視覺化提示**:
    *   使用不同 Icon 代表任務類型 (Feature, Bugfix, Agent Task, Review)。
    *   進度條顯示 (根據子任務完成比例或 checklist 完成度)。
    *   Assignee 頭像或縮寫顯示。

### 2.2 強大的篩選與排序 (Filtering & Sorting)

在 Explorer 頂部提供 Filter Bar：

*   **篩選條件**:
    *   `Status`: Pending, In Progress, Completed, Blocked
    *   `Priority`: Critical, High, Medium, Low
    *   `Assignee`: Me, Agent, Others, Unassigned
    *   `Type`: Regular, Agent, Review
    *   `Tag`: 根據 tags 欄位篩選
*   **排序方式**:
    *   Update Time (最近更新)
    *   Priority (優先級)
    *   Created Time (建立時間)
    *   Deadline (如有)

### 2.3 快速操作與命令 (Quick Actions)

*   **快速新增任務 (Quick Add)**:
    *   Project/Module 自動偵測：若當前編輯器打開了 `pog-task-api` 的檔案，新增任務時預設選中該模組。
    *   Inline Input：在 Explorer 中直接輸入標題按 Enter 新增。
    *   Slash Commands：支援 `/bug`, `/feature` 快速帶入 Templates。
*   **右鍵選單 (Context Menu)**:
    *   "Assign to Agent": 快速分派給預設或選擇的 LLM Agent。
    *   "Start Working": 自動將狀態改為 `in_progress` 並記錄 `started_at`。
    *   "Complete Task": 標記完成並詢問是否填寫 `actual_hours`。
    *   "Copy Task ID/Link": 方便在 Commit Message 或聊天中引用。

### 2.4 Agent 整合 (LLM Agent Integration)

*   **Agent 分派介面**:
    *   選擇任務 -> "Assign to Agent"。
    *   彈出設定視窗：選擇 Agent 模型 (Gemini/Claude)、設定 `agent_config` (Auto Claim, Retry Count)。
    *   **Context 注入**: 自動將當前選中的程式碼片段或檔案路徑加入任務的 `related_files`。
*   **Agent 狀態監控**:
    *   即時顯示 Agent 的執行狀態 (Thinking, Coding, verifying)。
    *   串流顯示 Agent 的 `history` 更新。

### 2.5 任務詳情編輯 (Detail Editor)

點擊 Explorer 中的任務，開啟一個 Webview 編輯器 (非純 JSON 文字)：

*   **GUI 表單**: 用戶友善的表單編輯 Title, Description, Priority 等。
*   **Checklist 管理**: 互動式的 Checklist，可拖拉排序、打勾完成。
*   **History Timeline**: 美觀的時間軸顯示任務歷史記錄。
*   **Markdown 預覽**: 支援 Description 和 Notes 的 Markdown 渲染。
*   **Record.md 連結**: 一鍵跳轉或建立對應的 `record.md`。

## 3. UI/UX 流程示意

1.  **使用者發現 Bug**:
    *   在 Code Editor 中選中一段有問題的程式碼。
    *   右鍵 -> "Create Task from Selection"。
    *   填寫標題 "Fix null pointer exception"。
    *   系統自動建立 `bugfix` 任務，並將該檔案加入 `related_files`。
2.  **分派給 Agent**:
    *   使用者在 Task Explorer 找到該任務。
    *   點擊 "Assign to Agent" 按鈕。
    *   Agent 自動認領 (Claimed) 並開始修復。
3.  **驗收**:
    *   使用者收到 Agent 完成通知。
    *   查看 Task Detail 中的 `history` 和 `generated content`。
    *   標記任務為 Completed。

## 4. 技術架構建議

*   **Backend**: 使用 File System Watcher 監聽 `pog-task/list/*.jsonl` 的變更，確保 VS Code 介面與檔案系統即時同步。
*   **Parser**: 實作高效的 JSONL Parser，支援增量讀取，避免大檔案效能問題。
*   **State Management**: 維護一份記憶體中的 Task Graph，處理父子關係和索引。

