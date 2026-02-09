# Task Record

## Task ID
2ccc2c7d-3935-4310-8a45-dc66359203d7

## Original Prompt

```
把 pog-task.py 也加入到 initPogTask
```

來自用戶請求：
```
---
# Step 1: Read Context
請閱讀以下文件及相關資源：
- pog-task/pog-task-agent-instructions.md
- pog-task/task.schema.json

# Step 2: Create or Join Task
請在 pog-task/list 下操作：
- project: {common}
- module: {improve}
- 如果任務不存在 → 新建任務
- 如果任務已存在 → 加入該任務
- parent task id: {9d868972-7472-4687-951c-06723223126f}

# Step 3: 理解任務 本次任務：
把 pog-task.py 也加入到 initPogTask

# Step 4: Generate Task Record
請生成 record.md 檔案（位於 pog-task/list/common/improve/record/{task-uuid}/record.md），內容包含：
- Original Prompt
- Task 目標
- Execution Plan / Checklist
- 相關參考文件
---
```

## Task 目標

在 POG Task Manager 的 `initPogTask` 指令中加入 `pog-task.py` 檔案的下載功能。目前 `initPogTask` 已經會下載以下兩個檔案：
1. `pog-task-agent-instructions.md`
2. `task.schema.json`

本任務目標是讓初始化指令也自動下載第三個檔案：
3. `pog-task.py` - 用於校驗 YAML 任務檔案格式的 Python 腳本

這樣用戶在初始化 POG Task 系統後，就可以立即使用 `python3 pog-task.py` 來校驗任務檔案，無需手動下載。

## Execution Plan / Checklist

### 1. 修改 initPogTask.ts
- [x] 在現有的下載邏輯中加入 `pog-task.py` 的下載
- [x] 定義 `pog-task.py` 的 GitHub 原始碼 URL
- [x] 定義目標路徑（應該與其他檔案一致，放在 `pogTaskDir` 下）
- [x] 使用現有的 `downloadFile` 函數進行下載

### 2. 測試功能
- [x] 在乾淨的專案中執行 Init POG Task 指令
- [x] 確認 `pog-task.py` 已成功下載到正確位置
- [x] 測試下載的 `pog-task.py` 是否可正常執行

### 3. 更新文件（如需要）
- [x] 檢查是否需要更新 README 或其他說明文件，註明初始化會包含 pog-task.py

### 4. 完成任務
- [x] 更新任務狀態為 completed
- [x] 記錄實際花費時間
- [x] 在 history 中添加完成記錄

## 相關參考文件

### 主要實作檔案
- `pog-task-manager/src/commands/initPogTask.ts` - 需要修改的主要檔案
- `pog-task/pog-task.py` - 需要加入下載清單的檔案

### 參考資源
- GitHub Repository: https://github.com/enjtorian/pog-task
- pog-task.py 原始檔案位於: `pog-task/pog-task.py`
- 預計下載 URL: `https://raw.githubusercontent.com/enjtorian/pog-task/main/pog-task/pog-task.py`

### 相關 Task Schema
- `pog-task/task.schema.json` - 定義任務格式的 JSON Schema
- `pog-task/pog-task-agent-instructions.md` - Agent 操作指南

### Parent Task
- Task ID: `9d868972-7472-4687-951c-06723223126f`
- Title: "POG Task Manager: 更新文檔與新增 Init Command"
- Status: completed

## 技術細節

### 現有下載邏輯
```typescript
const instructionsUrl = 'https://raw.githubusercontent.com/enjtorian/pog-task/main/pog-task/pog-task-agent-instructions.md';
const declareUrl = 'https://raw.githubusercontent.com/enjtorian/pog-task/main/pog-task/task.schema.json';

const instructionsPath = path.join(pogTaskDir, 'pog-task-agent-instructions.md');
const schemaPath = path.join(pogTaskDir, 'task.schema.json');

try {
    await downloadFile(instructionsUrl, instructionsPath);
    await downloadFile(declareUrl, schemaPath);
} catch (error) {
    vscode.window.showErrorMessage(`Failed to download configuration files: ${error}`);
}
```

### 需要加入的邏輯
```typescript
const pythonScriptUrl = 'https://raw.githubusercontent.com/enjtorian/pog-task/main/pog-task/pog-task.py';
const pythonScriptPath = path.join(pogTaskDir, 'pog-task.py');

// 在 downloadFile 呼叫中加入
await downloadFile(pythonScriptUrl, pythonScriptPath);
```

## 實作記錄

### 2026-02-09 00:00
- 建立任務 YAML 檔案
- 執行校驗，確認格式正確（27 個檔案全部通過）
- 建立本 record.md 檔案
- 準備開始修改 initPogTask.ts

### 2026-02-09 00:15
- 已完成 initPogTask.ts 的修改
- 加入以下內容：
  - `pythonScriptUrl`: `https://raw.githubusercontent.com/enjtorian/pog-task/main/pog-task/pog-task.py`
  - `pythonScriptPath`: `path.join(pogTaskDir, 'pog-task.py')`
  - 在下載區塊中加入 `await downloadFile(pythonScriptUrl, pythonScriptPath)`
- 檢查語法無錯誤
- 更新任務 checklist 與 history

### 2026-02-09 00:30
- 完成所有 checklist 項目
- 執行最終校驗：26 個檔案全部通過
- 更新任務狀態為 completed
- 實際花費時間：0.5 小時（估計 1 小時）
- **任務完成**

## 變更摘要

### 修改的檔案
- `pog-task-manager/src/commands/initPogTask.ts`

### 新增的行為
執行 "Init POG Task" 指令後，系統現在會下載三個檔案：
1. `pog-task-agent-instructions.md` - Agent 操作指南
2. `task.schema.json` - 任務 Schema 定義
3. `pog-task.py` - 任務校驗腳本（新增）

### 使用方式
初始化完成後，用戶可以直接執行：
```bash
cd pog-task
python3 pog-task.py
```
來校驗所有任務 YAML 檔案的格式。
