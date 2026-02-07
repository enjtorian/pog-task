# POG Task Agent Instructions

> 給 LLM Agent 的任務系統操作說明

##  📄 檔案位置和命名

### 檔案命名格式

```
{project}-{module-name}-task[-type].jsonl
```

**元件說明**：
- `{project}` - 專案前綴 (如 `pog-task`)
- `{module-name}` - 模組名稱，**完全自定義**
  - 可以是任何名稱：`main`, `api`, `ui`, `auth`
  - 可加數字前綴排序：`01-core`, `02-plugin`
- `task` - 固定關鍵字
- `[-type]` - 可選類型：`-agent`, `-review`（無則為一般任務）

### 文件類型

| 類型 | 檔案範例 | 說明 |
|------|---------|------|
| **一般任務** | `common-improve-task.jsonl` | 標準開發任務 |
| **Agent 任務** | `common-improve-task-agent.jsonl` | Agent 可自動認領執行 |
| **審查任務** | `common-improve-task-review.jsonl` | Code Review、文檔審查 |
| **排程任務** | `common-schedule-task.jsonl` | 定時執行的週期性任務 |

### 檔案命名範例

```
common-improve-task.jsonl         # Common 專案，Improve 模組
```

## 📊 文件結構

每個 JSONL 文件包含（按順序）：

```
第 1 行:    metadata 記錄
第 2 行:    task 記錄開始
...
```

> **注意**：Category 定義已統一移至 `pog-task/declare.jsonl`，不再需要在每個任務文件中定義。


## 🎯 記錄類型

### 1. Metadata (元數據)

```json
{
  "type": "metadata",
  "version": "1.0.0",
  "project": "pog-task",
  "module": "main",
  "file_type": "regular"
}
```

### 2. Category (分類)

引用 `pog-task/declare.jsonl` 中的定義。

```json
{
  "type": "category",
  "id": "feature",
  "name": "Feature",
  "description": "New feature implementation"
}
```

**標準分類**: feature, bugfix, refactor, test, doc, research

### 3. Task (任務)

完整的任務對象結構：

```json
{
  "type": "task",
  "id": "uuid",
  "title": "任務標題",
  "description": "詳細描述",
  "category": "feature",
  "priority": "low|medium|high|critical",
  "status": "pending|in_design|in_planning|in_progress|in_review|blocked|completed|cancelled",
  
  "created_at": "ISO 8601 時間",
  "started_at": null,
  "completed_at": null,
  "estimated_hours": 4,
  "actual_hours": 0,
  
  "assigned_to": null,
  "claimed_by": null,
  "claimed_at": null,
  
  "related_files": [],
  "related_docs": [],
  "dependencies": [],
  "blocking": [],
  "tags": [],
  
  "checklist": [
    {"text": "項目描述", "completed": false}
  ],
  
  "parent_task": null,
  
  "notes": "",
  "history": [
    {
      "timestamp": "ISO 8601",
      "agent": "agent-id",
      "action": "created",
      "message": "說明"
    }
  ]
}
```

### Agent 任務專用欄位

```json
{
  "file_type": "agent",
  "agent_config": {
    "auto_claim": true,
    "retry_count": 3,
    "timeout_hours": 24,
    "eligible_agents": ["gemini-*", "claude-*"]
  }
}
```

### 審查任務專用欄位

```json
{
  "file_type": "review",
  "review_config": {
    "review_type": "code|doc|design",
    "target_id": "original-task-uuid",
    "reviewers": ["agent-1", "agent-2"],
    "approval_required": 2
  }
}
```

### 排程任務專用欄位

```json
{
  "file_type": "scheduled",
  "schedule": {
    "enabled": true,
    "type": "cron",
    "cron": "0 2 * * *",
    "next_run": "2026-02-03T02:00:00+08:00"
  },
  "auto_execute": {
    "enabled": true,
    "command": "bash scripts/backup.sh",
    "timeout_minutes": 30
  }
}
```

## 🔄 基本操作

### 讀取任務

```bash
# 使用 jq
cat pog-task/list/pog-task-main-task.jsonl | \
  jq -r 'select(.type=="task") | .title'
```

### 選擇文件

根據任務性質選擇：

| 任務性質 | 選擇文件 |
|---------|---------|
| 標準開發任務 | `{project}-{module}-task.jsonl` |
| 可自動執行 | `{project}-{module}-task-agent.jsonl` |
| 需要審查 | `{project}-{module}-task-review.jsonl` |
| 定時任務 | `{project}-schedule-task.jsonl` |

### 創建任務

#### 一般流程

1. 生成 UUID v4
2. 確定任務類型，選擇文件
3. 創建完整的 task 對象
4. 追加到文件末尾

#### Agent 從用戶請求建立任務（推薦流程）

當 Agent 收到用戶請求需要建立任務時，**建議**按以下順序操作：

1. **生成 UUID v4** - 為任務建立唯一識別碼
2. **選擇合適的文件** - 根據任務性質選擇 JSONL 檔案
3. **建立 task 對象** - 填寫所有必填欄位
4. **追加到 JSONL 檔案**（強烈建議）
   - 使用 editFiles 編輯 JSONL 檔案
5. **✨ 建立 record.md**（強烈建議）
   - 建立 `pog-task/list/record/{task-uuid}/` 目錄
   - 建立 `record.md` 檔案 以繁體中文撰寫（強烈建議）
   - **首先記錄原始 Prompt**（完整的用戶請求）
   - 添加任務目標、實作計劃等內容
6. **執行任務** - 開始實際工作

**優點**：
- 📝 完整保留用戶原始意圖
- 🎯 避免執行過程偏離目標
- 🤝 其他 Agent 可快速理解需求
- 📊 便於未來審計和回顧

**範例參考**：
- `pog-task/list/record/37920c43-5a14-4016-ac43-2fd4973a8c3f/record.md`

### 認領任務

找到 `status === "pending"` 的任務，更新：

```json
{
  "status": "in_progress",
  "claimed_by": "your-agent-id",
  "claimed_at": "2026-02-02T14:00:00+08:00",
  "started_at": "2026-02-02T14:00:00+08:00"
}
```

並在 `history` 添加：

```json
{
  "timestamp": "2026-02-02T14:00:00+08:00",
  "agent": "your-agent-id",
  "action": "claimed",
  "message": "開始處理任務"
}
```

### 更新進度

1. 更新 `checklist` 中的 `completed` 狀態
2. 在 `history` 添加 progress 記錄

### 完成任務

更新欄位：

```json
{
  "status": "completed",
  "completed_at": "2026-02-02T16:00:00+08:00",
  "actual_hours": 2.5
}
```

標記所有 `checklist` 為 completed，並添加 history。

## 🌳 嵌套任務

### 父子關係

**父任務**：
```json
{
  "id": "parent-uuid"
}
```

**子任務**：
```json
{
  "id": "child-1-uuid",
  "parent_task": "parent-uuid"
}
```

### 無限層級

支援任意深度嵌套。

## 📝 任務記錄（推薦格式）

### 目錄結構

```
pog-task/list/record/{task-uuid}/record.md
```

這是**可選的**最佳實踐，用於詳細記錄：
- **Original Prompt** - 原始使用者請求（強烈建議）
- Timeline - 執行時間線
- Artifacts - 產出物
- Technical Details - 技術決策
- Metrics - 效能指標

### 內容建議

#### 1️⃣ 原始 Prompt（強烈建議）

在 record.md 開頭記錄**原始使用者請求**，便於：
- 追溯任務的真實意圖
- 理解任務背景和上下文
- 其他 Agent 快速理解需求
- 避免任務執行偏離原始目標

**格式範例**：
````markdown
## Original Prompt

```
[完整的使用者原始請求文字]
```
````

#### 2️⃣ 其他建議內容

- **Timeline** - 記錄關鍵時間點
- **Artifacts** - 列出產出的檔案和連結
- **Technical Details** - 記錄技術決策和實作細節
- **Metrics** - 效能指標、工時等數據

### 範例

實例範例：`pog-task/list/record/37920c43-5a14-4016-ac43-2fd4973a8c3f/record.md`

## ⚙️ History 標準

每次操作都應添加 history 記錄。

**標準 action 類型**：
- `created` - 創建任務
- `claimed` - 認領任務
- `progress` - 更新進度
- `completed` - 完成任務
- `blocked` - 標記阻塞
- `cancelled` - 取消任務

**格式**：
```json
{
  "timestamp": "ISO 8601 時間",
  "agent": "agent-id",
  "action": "action-type",
  "message": "具體說明"
}
```

## 📋 欄位說明

### 必填欄位

- `type` = `"task"`
- `id` (UUID v4)
- `title`
- `description`
- `category`
- `priority`
- `status`
- `created_at`
- `estimated_hours`
- `related_files` (可為空陣列)
- `related_docs` (可為空陣列)
- `dependencies` (可為空陣列)
- `blocking` (可為空陣列)
- `tags` (可為空陣列)
- `checklist` (可為空陣列)
- `notes` (可為空字串)
- `history` (至少有 created 記錄)

### 可選欄位

- `started_at`
- `completed_at`
- `actual_hours`
- `assigned_to`
- `claimed_by`
- `claimed_at`
- `parent_task`
- `file_type`
- `agent_config` (Agent 任務)
- `review_config` (審查任務)
- `schedule` (排程任務)
- `auto_execute` (排程任務)

## 🚫 注意事項

### DO ✅

1. **正確選擇文件** - 根據任務類型選對文件
2. **使用 UUID** - 新任務必須是 UUID v4
3. **填寫 History** - 每個操作都要記錄
4. **檢查依賴** - 認領前確認 dependencies
5. **更新狀態** - 及時更新任務狀態

### DON'T ❌

1. **不要跨類型** - Agent 任務不要放到一般任務文件
2. **不要省略必填** - 所有必填欄位都要填
3. **不要刪除 History** - 歷史記錄是審計依據
4. **不要估算為 0** - estimated_hours 應合理估算
5. **不要忽略格式** - 嚴格遵循 JSONL 格式

## 💡 最佳實踐

1. **任務粒度** - 2-4 小時為佳
2. **清晰命名** - 標題簡潔，描述詳細
3. **及時更新** - 狀態變更立即更新
4. **使用 Checklist** - 追蹤細項進度
5. **記錄詳細** - History 和 notes 包含關鍵資訊
6. **保留原始 Prompt** - 在 record.md 中記錄原始使用者請求
