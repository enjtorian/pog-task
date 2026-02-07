# 任務管理系統 系統設計

完整的任務管理系統說明文檔。

## 系統概述

這是一個基於 JSONL 格式的任務管理系統，專為 LLM Agent 協作和人工管理設計。

### 核心特點

- **JSONL 格式** - 每行獨立 JSON 對象，易於解析和追加
- **UUID 識別** - 每個任務全域唯一
- **類型分離** - 按任務性質分離到不同文件
- **無限嵌套** - 支援子任務層級結構
- **Agent 友好** - 適合自動化處理

## 檔案結構

### 目錄佈局

```
pog-task/
├── README.md          # 本文件 - 系統總覽
├── declare.jsonl      # 任務分類定義
├── pog-task-agent-instructions.md # Agent 操作指南
├── pog-task-design.md # 系統設計
└── list/              # 實際任務列表
    └── common-improve-task.jsonl
    └── record/{uuid}/record.md       # 任務記錄範例
```

### 檔案命名規則

**格式**：`{project}-{module-name}-task[-type].jsonl`

**元件說明**：

| 元件 | 說明 | 範例 |
|------|------|------|
| `{project}` | 專案前綴 | `pog`, `frontend`, `infra` |
| `{module-name}` | 模組名稱，**完全自定義** | `main`, `api`, `ui`, `01-core`, `02-plugin` |
| `task` | 固定關鍵字 | `task` |
| `[-type]` | 可選類型後綴 | `-agent`, `-review`（無則為一般任務）|

**模組名稱規則**：
- 完全自定義，可以是任何有意義的名稱
- 可使用數字前綴便於排序（如 `01-`, `02-`）
- 建議使用小寫和連字符

**範例**：

```
common-improve-task.jsonl         # Common 專案，Improve 模組
pog-main-task.jsonl              # 專案 pog，模組 main
pog-api-task-agent.jsonl          # 專案 pog，模組 api，Agent 任務
pog-01-core-task.jsonl            # 專案 pog，模組 01-core（數字排序）
pog-02-plugin-task-review.jsonl   # 專案 pog，模組 02-plugin，審查任務
frontend-auth-task.jsonl          # 專案 frontend，模組 auth
pog-schedule-task.jsonl           # 專案 pog，排程任務（通常無模組）
```

## 任務類型

### 1. 一般任務 (Regular Tasks)

**檔案**: `{project}-{module}-task.jsonl`

用於標準的開發、維護、文檔等人工任務。

**特點**:
- 人工創建和執行
- 標準任務欄位
- 支援 checklist 和子任務

**適用場景**:
- 功能開發
- Bug 修復
- 文檔撰寫
- 代碼重構

### 2. Agent 任務 (Agent Tasks)

**檔案**: `{project}-{module}-task-agent.jsonl`

可由 Agent 自動認領和執行的任務。

**特點**:
- 包含 `agent_config` 配置
- 支援自動認領 (`auto_claim`)
- 支援重試機制
- 限定執行 Agent (`eligible_agents`)

**適用場景**:
- 自動生成文檔
- 批次數據處理
- 代碼分析
- 定期報告

### 3. 審查任務 (Review Tasks)

**檔案**: `{project}-{module}-task-review.jsonl`

代碼審查、文檔審查等需要複核的任務。

**特點**:
- 包含 `review_config` 配置
- 關聯原始任務 (`target_id`)
- 指定審查者 (`reviewers`)
- 需要批准數 (`approval_required`)

**適用場景**:
- Code Review
- 設計審查
- 文檔審查
- 品質檢查

### 4. 排程任務 (Scheduled Tasks)

**檔案**: `{project}-schedule-task.jsonl`

定時執行的週期性任務。

**特點**:
- 包含 `schedule` 配置（cron 表達式）
- 包含 `auto_execute` 配置
- 記錄執行歷史
- 自動觸發

**適用場景**:
- 資料庫備份
- 系統健康檢查
- 數據同步
- 定期報告

## JSONL 文件結構

每個 JSONL 文件包含 3 種類型的 JSON 對象：

### 1. Metadata (元數據)

**位置**: 第 1 行

```json
{
  "type": "metadata",
  "version": "1.0.0",
  "project": "pog-task",
  "module": "main",
  "file_type": "regular|agent|review|scheduled",
  "active_agents": []
}
```

### 2. Category (分類)

**位置**: 統一管理於 `pog-task/declare.jsonl`，不需要在每個任務文件中重複定義。

```json
{
  "type": "category",
  "id": "feature",
  "name": "Feature",
  "description": "New feature implementation"
}
```

**標準分類**:
- `feature` - 功能開發
- `bugfix` - Bug 修復
- `refactor` - 代碼重構
- `test` - 測試
- `doc` - 文檔
- `research` - 研究

### 3. Task (任務)

**位置**: Category 之後，大部分內容

**基本結構**:
```json
{
  "type": "task",
  "id": "uuid",
  "title": "任務標題",
  "description": "詳細描述",
  "category": "feature",
  "priority": "high",
  "status": "pending",
  "created_at": "2026-02-02T10:00:00+08:00",
  "estimated_hours": 4,
  "checklist": [],
  "history": []
}
```

**完整欄位說明請參考**: [Agent 指南](./pog-task-agent-instructions.md)

## 嵌套任務

### 父子關係

**父任務**包含子任務 UUID 列表：
```json
{
  "id": "parent-uuid",
  "title": "實作認證系統"
}
```

**子任務**引用父任務：
```json
{
  "id": "child-1-uuid",
  "title": "實作 JWT Token",
  "parent_task": "parent-uuid"
}
```

### 無限層級

可以有任意深度的嵌套：
```
父任務
├── 子任務 A
│   ├── 子任務 A.1
│   └── 子任務 A.2
│       └── 子任務 A.2.1
└── 子任務 B
```

## 任務記錄（推薦格式）

### 目錄結構

```
pog-task/list/record/{task-uuid}/record.md
```

這是**可選的**最佳實踐，用於記錄：
- Timeline - 執行時間線
- Artifacts - 產出物和連結
- Technical Details - 技術決策
- Metrics - 效能指標

## 狀態轉換

```
pending (待辦)
   ↓ [認領]
in_progress (進行中)
   ↓ [遇到問題]     ↓ [完成]
blocked (阻塞) → completed (完成)
   ↓ [解決]
in_progress
```

## 優先級

- `critical` - 緊急重要
- `high` - 高優先級
- `medium` - 中優先級
- `low` - 低優先級

## 最佳實踐

1. **任務粒度** - 單個任務 2-4 小時
2. **清晰標題** - 簡潔明確，50 字內
3. **詳細描述** - 包含背景、目標、驗收標準
4. **及時更新** - 狀態變更立即更新
5. **使用 Checklist** - 追蹤子項目完成度
6. **記錄 History** - 重要操作都要記錄

## 進一步閱讀

- [Agent 指南](./pog-task-agent-instructions.md) - Agent 操作規範和詳細欄位說明
