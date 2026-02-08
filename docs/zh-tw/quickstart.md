# 快速入門 (Quick Start)

POG Task Manager 是一個專為 VS Code 設計的擴充套件，旨在協助開發者與 LLM Agent 高效協作管理 POG Task。它提供直觀的介面來檢視、管理和追蹤專案任務，將人類意圖轉化為 Agent 可執行的工作單元。

## 安裝方式

1.  在 VS Code 擴充套件市場搜尋 **"POG Task Manager"**，或直接訪問 [Marketplace 頁面](https://marketplace.visualstudio.com/items?itemName=enjtorian.pog-task-manager)。
2.  點擊安裝即可開始使用。

安裝完成後，您可以在 VS Code 的 Activity Bar 中看到 POG Task Manager 的圖示。

## 專案設定

在使用 POG Task Manager 之前，請確保您的專案符合 POG Task 的檔案結構規範：

1.  **初始化專案**：開啟命令面板 (`Cmd+Shift+P`)，輸入 `POG Task Manager: Init POG Task` 並執行。這將自動建立 `pog-task` 目錄並下載必要的配置檔。
2.  (手動替代方案) **建立目錄**：在專案根目錄下建立 `pog-task/list/` 資料夾。
3.  (手動替代方案) **建立任務檔**：建立符合 POG Task 規範的 `.yaml` 檔案（例如 `建立優化任務.yaml`）。
4.  (手動替代方案) **定義分類**：建立 `pog-task/task.schema.json` 用於定義任務分類。

標準的目錄結構如下：

```
pog-task/
├── pog-task-agent-instructions.md              # Agent 操作指南
├── task.schema.json                            # 任務結構定義
├── list/                                       # 活躍任務資料庫
│   └── {project}/                              # 專案命名空間
│       └── {module}/                           # 模組命名空間
│           ├── {task-title}.yaml               # 結構化任務 (AI 可讀)
│           └── record/                         # 執行產物
│               └── {uuid}/                     # 每個任務的唯一資料夾
│                   └── record.md               # 執行和推理軌跡
```

## 核心工作流

POG Task Manager 的設計圍繞著與 AI Agent 的協作循環：

### 1. 建立任務 (Create Task)

當您有一個新的構想或需求，需要 Agent 協助將其轉化為正式的 POG Task 時：

1.  開啟 POG Task Manager 側邊欄。
2.  在 **Prompt Templates** 列表中選擇 **"Create Task"**，或在任務列表空白處右鍵選擇 **"Copy Create Prompt"**。
3.  將複製的指令貼給 LLM Agent。
4.  Agent 將此指令執行後，會幫助您在 `.yaml` 中建立任務並生成初始的 `record.md`。

### 2. 執行任務 (Execute Task)

當任務已經建立（狀態通常為 `pending` 或 `in_progress`），您希望指派 Agent 開始實際工作時：

1.  在任務列表中的目標任務上點擊右鍵。
2.  選擇 **"Copy Execute Prompt"**。
3.  將複製的指令貼給 LLM Agent。
4.  指令中會自動包含任務的上下文（YAML 內容、Record 路徑等），Agent 將據此執行任務並更新進度。

### 3. 查看與管理 (View & Manage)

*   **查看記錄 (Open Record)**：在任務上右鍵選擇 **"Open Record"**，即可開啟該任務對應的 `record.md`，檢視 Agent 的思考過程、執行計畫與產出。
*   **更新狀態**：您可以直接在 `.yaml` 中修改狀態，或透過擴充套件介面進行部分操作（如切換狀態），列表會即時反映變更。
*   **重新整理**：若檔案變更未立即顯示，可點擊列表上方的重新整理按鈕，或使用命令 `POG Task Manager: Refresh Tasks`。

## 下一步

*   深入了解 [核心概念](../index.md)
*   查看 [常見問題](faq.md)
