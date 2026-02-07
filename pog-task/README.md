# POG 任務管理系統

專案的任務管理系統，支援多 LLM Agent 協作。

> **POG Task 是一個 AI 原生的任務治理層 (Governance Layer)，確保任務意圖可被 AI 解釋、執行與審計。**

## 📁 目錄結構

```
pog-task/
├── README.md          # 本文件 - 系統總覽
├── declare.jsonl      # 任務分類定義
├── pog-task-agent-instructions.md # Agent 操作指南
├── pog-task-design.md # 系統設計
└── list/              # 實際任務列表
    ├── common-improve-task.jsonl
    └── record/{uuid}/record.md       # 任務記錄範例
```

## 🚀 快速開始

### 對於 LLM Agent 🤖
1. 閱讀 **[Agent 指南](./pog-task-agent-instructions.md)** - 操作規範和結構說明
2. 查看 **[任務列表](./list/)** - 了解實際任務範例
3. 開始工作 - 選擇適合的任務類型

### 對於開發者 👨‍💻
1. 閱讀 **[系統設計](./pog-task-design.md)** - 系統概念和設計
2. 查看 **[現有任務](./list/)** - 參考實際運作方式
3. 開始使用 - 創建或認領任務

## ✨ 核心特性

- ✅ **JSONL 格式** - 每行獨立 JSON，流式處理友好
- ✅ **UUID 識別** - 全域唯一，支援分散式協作
- ✅ **無限層級** - 支援任務包含子任務，可無限嵌套
- ✅ **檔案分離** - 按任務類型分離，便於管理
- ✅ **多 Agent** - 多個 AI Agent 可同時協作

## 📂 任務類型與文件命名

### 檔案命名格式

```
{project}-{module-name}-task[-type].jsonl
```

**組成部分**：
- `{project}` - 專案前綴 (如 `pog`)
- `{module-name}` - 模組名稱，完全自定義 (如 `main`, `api`, `01-core`)
  - 可加數字前綴便於排序 (如 `01-main`, `02-api`)
- `task` - 固定關鍵字
- `[-type]` - 可選的類型後綴 (`-agent`, `-review`)

### 任務類型

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

## 📋 任務結構

每個 JSONL 文件包含：
1. **metadata** - 系統元數據（第 1 行）
2. **category** - 任務分類（數行）
3. **task** - 任務記錄（每行一個）

詳細結構請參考：[系統設計](./pog-task-design.md)

## 🎯 任務記錄（推薦格式）

任務執行記錄可選擇性使用，推薦格式：

```
pog-task/list/record/{task-uuid}/record.md
```

這是**可選的**最佳實踐，用於記錄詳細的執行過程、技術決策和產出物。

範例：可以參考 `list/record/` 目錄下的實際記錄。

## 📖 文檔

- **[Agent 指南](./pog-task-agent-instructions.md)** - Agent 操作規範和範例
- **[現有任務列表](./list/)** - 參考實際運作方式

## 🤝 操作流程

1. **選擇文件** - 根據任務類型選擇對應的 JSONL 文件
2. **創建任務** - 添加新的 task 記錄
3. **認領任務** - 更新 `claimed_by` 和 `status`
4. **執行工作** - 完成任務內容
5. **更新狀態** - 標記為 completed 並填寫實際工時

詳細操作請參考：[Agent 指南](./pog-task-agent-instructions.md)

## 💡 設計原則

1. **簡單明確** - 檔案命名清晰，結構易懂
2. **類型分離** - 不同任務類型使用不同文件
3. **彈性命名** - 模組名稱完全自定義
4. **可選記錄** - 詳細記錄按需使用
5. **Agent 友好** - 適合 AI Agent 自動處理

## 📊 版本

- **版本**: 1.0.0
- **更新**: February 2026

---
