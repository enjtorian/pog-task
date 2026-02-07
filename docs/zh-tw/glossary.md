# 術語表 (Glossary)

POG Task 中所使用術語的綜合定義。

---

## 核心概念 (Core Concepts)

### 提示編排治理 (Prompt Orchestration Governance, POG)
一個將提示詞 (Prompts) 視為軟體開發生命週期 (SDLC) 中一等軟體資產的綜合管理框架。POG 提供了系統化的流程來發現、標準化、驗證、版本控制和部署提示詞，同時維持治理與品質控制。

### POG Task
一個被視為「意圖單位 (Unit of Intention)」的 AI 原生任務單元。與傳統的自由格式任務不同，POG Task 是結構化的 (JSONL)、機器可讀的、可審計的 (透過 `record.md`)，並受嚴格協議治理。它在限制 Agent 自主性的同時促進協作，確保如果一個任務無法被 AI Agent 以確定性的方式解讀與執行，那它就不算是一個任務。

### 意圖單位 (Unit of Intention)
POG Task 中的核心概念，將任務視為結構化、機器可讀且由 Agent 治理的實體，而不僅僅是自由格式的文字。它確保目標對 AI 執行來說是明確、受約束且無歧義的。

### 結構化狀態流 (Structured Stream)
使用確定性的 JSONL 格式 (`pog-task/list/*.jsonl`) 來表示任務的狀態與歷史。此格式針對機器解析與高效追加進行了優化，作為任務系統的「骨幹」。

### 推理日誌 (Reasoning Log, `record.md`)
每個任務專屬的 Markdown 檔案 (儲存於 `pog-task/list/record/{uuid}/`)，用於捕捉 Agent 行動背後的「原因」。它包含原始提示詞、執行計畫、決策推理、時間軸以及產出物的連結。

### 治理層 (Governance Layer)
POG 中的標準化系統，確保所有 AI 行動都是結構化、被記錄且可審計的。它作為安全邊界，管理 Agent 如何創建任務、領取工作以及記錄其產出。

### 審計軌跡 (Audit Trail)
任務的完整且可驗證的歷史記錄，結合了 JSONL 串流中的狀態變更與 `record.md` 中的詳細推理。這讓人類可以審查、除錯並驗證 AI 工作的每一個步驟。

### 交接契約 (Handoff Contract)
當 Agent「領取 (claims)」任務時形成的明確協議。透過將任務狀態更新為 `in_progress` 並設定 `claimed_by`，Agent 接受任務中定義的意圖，並承諾依照協議執行它。

### 副作用 (Side Effects)
AI Agent 對程式碼、系統配置或資料所做的變更。在 POG 中，這些變更受到嚴格治理，必須被明確記錄，並可追溯回特定的任務與推理過程。

### POG Task Manager
作為 POG 生態系統人類介面的工具 (例如 VS Code Extension)。它允許使用者以友善的方式視覺化任務串流、管理任務生命週期 (創建、更新)，並審查 Agent 的推理日誌 (`record.md`)，橋接人類意圖與機器執行之間的差距。
