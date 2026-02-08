# POG Task Manager

這是一個專為管理 POG Task (`pog-task/list/**/*.yaml`) 設計的 VS Code 擴充套件。它旨在協助開發者與 LLM Agent 高效協作，提供直觀的介面來檢視、管理和追蹤專案任務。

## 核心概念：什麼是 POG Task？

> **從人類意圖到 Agent 可執行的工作。**

POG Task 是一個 AI 原生的任務治理模型，將任務視為結構化、可解釋且可審計的意圖單元 (Units of Intention)。

不僅僅是將任務視為待辦事項清單，POG Task 強調：
*   **結構化流 (Structured Stream)**：使用 YAML 格式儲存，對 AI 友善且易於解析。
*   **推理軌跡 (Reasoning Trace)**：透過 `record.md` 記錄 Agent 的思考過程與執行細節。
*   **人機協作**：明確區分人類的「意圖定義」與 Agent 的「執行與推理」。

此擴充套件即是為了在 VS Code 中與 POG Task 系統無縫協作而設計，讓您能輕鬆管理這些結構化意圖。

## 架構

系統依賴於一個基於檔案、Git 友好的結構，支援透明度和可攜性。

### 儲存庫結構

```
pog-task/
├── pog-task-agent-instructions.md # Agent 操作指南
├── pog-task-design.md             # 系統設計文檔
├── list/                          # 活躍任務資料庫
│   └── {project}/
│       └── {module}/
│           ├── {task}.yaml        # 結構化任務 (AI 可讀)
│           └── record/            # 執行產物
│               └── {uuid}/        # 每個任務的唯一資料夾
│                   └── record.md  # 執行和推理軌跡
```

### 為什麼選擇基於檔案？
*   **Git 整合**：利用最經久考驗的版本化記憶體系統。
*   **共通語言**：Markdown 和 YAML 是人類和 LLM 原生的共通語言。
*   **可攜性**：零鎖定。適用於 VS Code、CI/CD、Agent 框架或任何文字編輯器。

### 組件

#### 1. 任務流 (`*.yaml`)
任務儲存在 YAML 檔案中，分層目錄組織。關於目錄結構與命名約定請參閱 `pog-task/README.md` 或 `pog-task/pog-task-design.md`。

#### 2. 推理記錄 (`record.md`)
對於複雜任務，`record.md` 檔案充當執行過程的「大腦」。它捕捉 Agent 的思考過程、原始使用者提示詞 (Prompt) 以及計畫的演變。這對於除錯 Agent 行為和確保意圖對齊至關重要。

#### 3. VS Code 外掛 (可選介面)
該外掛是一個介面，而非核心。它用於視覺化 `task.yaml` 流，協助人類編寫對 AI 友好的任務，並檢查執行記錄。

## 工作流

### 1. 定義意圖
人類（或 Agent）在 `*.yaml` 檔案中建立一個任務。它定義了目標、優先級和初始上下文。

### 2. 指派與認領
Agent（或人類）識別待處理的任務並透過更新任務狀態和將其指派給自己來「認領」它。這避免了多 Agent 環境中的衝突。

### 3. 執行與推理
Agent 建立 `record.md` 來記錄其計畫。它執行工作（編碼、研究等），並隨之更新記錄。

### 4. 完成與驗證
一旦完成，Agent 在 YAML 檔案中將任務標記為完成並完善記錄。人類可以審查 `record.md`，不僅驗證輸出，也驗證過程。

## 功能特色 (Features)

### 1. 任務列表管理 (Task List Management)

提供直觀的側邊欄樹狀視圖 (Tree View)，自動依照 Project 與 Module 分組顯示任務。支援豐富的狀態圖示與層級展開，讓您一眼掌握專案進度。

![Task List](https://github.com/enjtorian/pog-task/raw/HEAD/pog-task-manager/assets/Detail-Plugin-Task-List.png)

*   **即時監聽**：自動監聽 `pog-task/list/**/*.yaml` 檔案變更，新增或修改任務會立即反映在列表中。
*   **狀態篩選**：可過濾顯示特定狀態（如 In Progress, Pending）的任務。

### 2. Agent 協作整合 (Prompt Templates)

內建 Agent Prompt Template 管理功能，針對不同場景（如：建立新任務、執行現有任務）提供標準化的 Prompt。

![Prompt Templates](https://github.com/enjtorian/pog-task/raw/HEAD/pog-task-manager/assets/Detail-Plugin-Prompt-Templates.png)

*   **一鍵複製**：快速產生並複製 Agent 指令，直接貼上給 LLM 使用。
*   **上下文注入**：自動將任務上下文 (Context) 整合進 Prompt 中。

### 3. 任務詳情與推理記錄 (Task Detail & Record)

*   **Webview 編輯器**：透過表單介面檢視與編輯任務詳細資訊。
*   **Record 存取**：快速開啟任務對應的 `record.md`，檢視執行過程與推理紀錄。

## Agent Prompt 指南 (Prompt Usage)

POG Task Manager 提供了兩種主要的 Prompt 生成功能，協助您快速啟動與 Agent 的協作：

### 1. 建立新任務 (Create Prompt)
適用於從零開始建立一個新任務。
*   **使用時機**：當您有一個新的構想或需求，需要 Agent 協助將其轉化為正式的 POG Task。
*   **產生內容**：包含閱讀 [Agent Guide](https://github.com/enjtorian/pog-task/blob/main/pog-task/pog-task-agent-instructions.md)、Category 定義，以及建立任務與 `record.md` 的標準步驟。
*   **操作方式**：在 Prompt Templates 列表中選擇 "Create Task"，或在任務列表空白處右鍵選擇 "Copy Create Prompt"。

"Copy Create Prompt" 範例：
---
    # Step 1: Read Context
    請閱讀以下文件及相關資源：
    - pog-task/pog-task-agent-instructions.md
    - pog-task/task.schema.json

    # Step 2: Create or Join Task
    請在 pog-task/list 下操作：
    - project: {${project}}
    - module: {${module}}
    - 如果任務不存在 → 新建任務
    - 如果任務已存在 → 加入該任務
    - parent task id: {task.parent_task}

    # Step 3: 理解任務 本次任務：
        xxxxxxxx

    # Step 4: Generate Task Record
    請生成 record.md 檔案（位於 pog-task/list/{project}/{module}/record/{task-uuid}/record.md），內容包含：
    - Original Prompt
    - Task 目標
    - Execution Plan / Checklist
    - 相關參考文件
---

### 2. 執行任務 (Execute Prompt)
適用於執行已經存在的任務。
*   **使用時機**：當任務已經建立（處於 Pending 或 In Progress 狀態），您希望指派 Agent 開始實際工作。
*   **產生內容**：
    *   **Context**：自動包含任務所在的 YAML 檔案與對應的 `record.md` 路徑。
    *   **指令**：明確指示 Agent 執行特定 ID 的任務，並更新狀態與進度。
*   **操作方式**：在任務列表中的特定任務上右鍵，選擇 "Copy Execute Prompt"。

"Copy Execute Prompt" 範例：
---
    # Step 1: Read Context
    請閱讀以下文件及相關資源：
    - pog-task/pog-task-agent-instructions.md
    - pog-task/list/${filename}
    - pog-task/list/${project}/${module}/record/${task.id}/record.md

    # Step 2: Execute Task
    請執行 pog-task/list/${filename} 中指定 Task：
    - task id: ${task.id}

    # Step 3: Update Progress
    - 更新 status: in_progress → in_review
    - 更新 checklist / notes / actual_hours
    - 在 history 中加入執行紀錄
    - 在 record.md 中記錄關鍵決策與產出物
---

## 使用方式 (Usage)

1.  **專案結構準備**:
    確保您的專案根目錄下有 `pog-task/list/` 資料夾，並包含符合 POG Task 規範的 `.yaml` 檔案 (例如 `common/improve/task.yaml`)。

2.  **啟動與瀏覽**:
    安裝套件後，點擊 VS Code Activity Bar 中的 POG Task Manager 圖示，即可開啟任務列表。

3.  **常用操作**:
    *   **Refresh Tasks**: 在 Command Palette 輸入 `POG Task Manager: Refresh Tasks` 可手動強制重新讀取所有任務。
    *   **Context Menu**: 在任務項目上點擊右鍵，可執行相關操作（如複製 Prompt、開啟 Record、切換狀態等）。
    *   **Init POG Task**: 在 Command Palette 輸入 `POG Task Manager: Init POG Task` 可快速初始化專案結構。

## 版本資訊 (Release Notes)

### 1.1.0
*   **YAML 全面轉型**：外掛程式現在支援全新的 YAML 格式與 `{project}/{module}` 巢狀目錄結構。
*   **效能優化**：改進了 YAML 任務列表的讀取與渲染效能。

### 1.0.1
*   新增 `Init POG Task` 指令，自動初始化專案結構。
*   更新文件連結與 Marketplace 資訊。

### 1.0.0
*   專案初始化。
