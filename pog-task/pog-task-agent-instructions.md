# POG Task Agent Instructions

> 給 LLM Agent 的任務系統操作說明 (YAML 版)

## 📄 檔案位置和命名

### 檔案路徑格式

```
pog-task/list/{project}/{module}/{task-title}.yaml
```

**元件說明**：
- `{project}` - 專案名稱 (如 `common`, `pog`)
- `{module}` - 模組名稱 (如 `improve`, `core`)
- `{task-title}` - 任務標題，作為檔案名稱

### 範例

```
pog-task/list/common/improve/建立任務管理功能.yaml
```

## 📊 檔案結構

每個 YAML 檔案代表一個 `task` 對象。

### 核心欄位 (Task)

```yaml
type: "task"
id: "uuid" # UUID v4
title: "任務標題"
description: "詳細描述"
category: "feature"
priority: "low|medium|high|critical"
status: "pending|in_design|in_planning|in_progress|in_review|blocked|completed|cancelled"

created_at: "ISO 8601 時間"
started_at: null
completed_at: null
estimated_hours: 4
actual_hours: 0

claimed_by: null
claimed_at: null

related_files: []
dependencies: []
blocking: []
tags: []

checklist:
  - text: "項目描述"
    completed: false

parent_task: null

notes: ""
history:
  - timestamp: "ISO 8601"
    agent: "agent-id"
    action: "created"
    message: "說明"
```

## 🔄 基本操作

### 讀取任務

直接讀取對應目錄下的 `.yaml` 檔案內容。

### 建立任務（強烈建議流程）

當 Agent 收到用戶請求需要建立任務時：

1. **確定分類** - 根據專案與模組確定目錄：`pog-task/list/{project}/{module}/`
2. **生成 UUID v4** - 為任務建立唯一識別碼
3. **編寫 YAML** - 填寫所有必填欄位
4. **校驗格式**（關鍵步驟）：
   執行 `python3 pog-task.py` 確保新建立的 YAML 符合 `task.schema.json`
5. **✨ 建立 record.md**：
   - 路徑：`pog-task/list/{project}/{module}/record/{task-uuid}/record.md`
   - **開頭記錄 Original Prompt**（完整的用戶請求）
   - 添加任務目標、實作計劃等內容

### 認領與更新任務

1. 找到目標 YAML 檔案。
2. 更新 `status`、`claimed_by`、`claimed_at` 等欄位。
3. 在 `history` 添加對應的 action 記錄。
4. **再次執行校驗**，確保修改後的檔案格式正確。

## ⚙️ History 標準 Action

- `created` - 建立任務
- `claimed` - 認領任務
- `progress` - 更新進度
- `completed` - 完成任務
- `blocked` - 標記阻塞
- `cancelled` - 取消任務

## 🚫 注意事項

### DO ✅
1. **執行校驗** - 每次建立或修改 YAML 後，務必執行 `python3 pog-task.py`。
2. **目錄結構** - 嚴格遵守 `{project}/{module}/` 的目錄結構。
3. **保留原始 Prompt** - 在 `record.md` 中完整記錄用戶意圖。

### DON'T ❌
1. **不要違反 Schema** - 嚴格遵循 `task.schema.json` 定義的欄位與格式。
2. **不要跨專案錯放** - 確保任務檔案放在正確的專案目錄下。
3. **不要遺漏 History** - 所有的狀態變更必須紀錄於 `history` 陣列中。

## 💡 最佳實踐

1. **任務粒度** - 2-4 小時。
2. **校驗自動化** - 如果情況允許，請將校驗作為工作流的一部分。
3. **清晰命名** - 檔案名稱應反映任務內容。
