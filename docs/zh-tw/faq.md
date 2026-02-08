# 常見問題 (FAQ)

關於 POG Task 的常見問題。

---

## 一般問題

### 什麼是 POG Task？
POG Task 是一個 **AI 原生任務治理模型**，專為 AI Agent 作為一等公民參與的環境而設計。它將任務視為 **意圖單位 (Units of Intention)** — 結構化、機器可讀、可審計且由 Agent 治理。

### POG Task 與 Jira 或 Trello 等工具有何不同？
傳統工具假設任務由人類解讀與執行，這對 AI 來說會造成模稜兩可。POG Task 專為 AI 優先環境設計：
- **結構化**：使用結構化、確定性的 YAML 檔案，而非自由格式文字。
- **可追溯性**：在 `record.md` 中捕捉決策推理與執行過程。
- **治理**：確保完整的審計軌跡並嚴格治理「副作用」。

### 什麼是 `record.md`？
`record.md` 是儲存於每個任務中的 **執行與推理日誌**。它捕捉 AI 行動背後的「原因」，包括原始提示詞、執行計畫、時間軸、產出物與技術註解，作為人類可讀的審計軌跡。

### AI Agent 如何與 POG Task 互動？
Agent 透過兩種主要模式互動：
1.  **讀取 + 創建/加入**：理解協議並建立意圖。
2.  **讀取 + 執行**：領取任務、執行步驟、更新狀態，並在 `record.md` 中記錄推理。

### POG Task 適合誰？
它適合使用 AI 輔助開發且需要以下特性的組織：
- 清晰、可審計的任務歷史。
- 減少人類與 AI 協作時的模稜兩可。
- 對 AI 行為進行系統化治理。

## 架構與設計

### YAML 任務檔案與 `record.md` 的關係是什麼？
`*.yaml` 任務檔案是任務狀態的 **骨幹**，每個檔案代表一個任務，適合機器快速讀取與檢索。
`record.md` 是任務的 **大腦**，用於儲存詳細的執行計畫、推理過程、對話記錄與產出物。當任務變得複雜時，Agent 會在 `record.md` 中進行思考與記錄。

### 為什麼專案需要特定的 `pog-task/list/` 目錄結構？
這是為了讓 POG Task Manager (以及 Agent) 能自動識別與管理任務。
- `pog-task/list/{project}/{module}/*.yaml`: 活躍的任務列表。
- `pog-task/list/{project}/{module}/record/{uuid}/`: 每個任務的專屬資料夾，包含 `record.md`。

## VS Code 擴充套件

### POG Task Manager 提供哪些核心功能？
- **任務列表 (Task List)**：自動分組顯示專案中的所有 POG Task，支援狀態篩選與即時更新。[前往 Marketplace 下載](https://marketplace.visualstudio.com/items?itemName=enjtorian.pog-task-manager)。
- **Prompt Templates**：內建 "Create Task" 與 "Execute Task" 等標準提示詞模版，一鍵複製給 Agent 使用。
- **任務詳情 (Task Detail)**：提供圖形化介面檢視與編輯任務屬性。
- **Record 存取**：快速開啟並編輯對應的 `record.md`。

### 如何手動更新任務列表？
擴充套件會自動監聽檔案變更。但在極少數情況下，您可以使用 Command Palette (`Cmd+Shift+P`) 輸入 `POG Task Manager: Refresh Tasks` 來強制重新讀取。

## Agent 協作

### 什麼是 "Create Task" Prompt？
當您想從頭建立一個新任務時使用。它會指示 Agent：
1.  閱讀專案上下文與規範。
2.  在 `.yaml` 中建立新任務條目。
3.  初始化 `record.md` 並填寫任務目標與執行計畫。

### 什麼是 "Execute Task" Prompt？
當任務已經存在 (例如狀態為 `todo` 或 `in_progress`)，您想指派 Agent 執行時使用。它會指示 Agent：
1.  讀取該任務的詳細資訊與 `record.md`。
2.  執行實際工作。
3.  更新任務狀態與進度記錄。

### 如何獲取這些 Prompt？
在 VS Code 擴充套件的 **任務列表** 中，對任一任務點擊右鍵，即可看到 `Copy Create Prompt` 或 `Copy Execute Prompt` 選項。
