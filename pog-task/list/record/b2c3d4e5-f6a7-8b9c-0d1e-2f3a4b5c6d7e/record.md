## Original Prompt

```
# Step 1: Read Context
請閱讀以下文件及相關資源：
- pog-task/pog-task-agent-instructions.md
- pog-task/declare.jsonl

# Step 2: Create or Join Task
請在 pog-task/list 下操作：
- project: {common}
- module: {improve}
- 如果任務不存在 → 新建任務
- 如果任務已存在 → 加入該任務

# Step 3: 理解任務 本次任務：
1. 更新 本次 修改的 CHANGELOG.md to version 1.0.1
同時更新 : README.md
同時更新 : pog-task-manager/README.md, pog-task-manager/CHANGELOG.md
    更新版本號 : package.json

2. 在 pog-task-manager 下 建立一個 for plugin 的 開發者手冊
    針對 專案結構 與 vsce package 等等的語法

# Step 4: Generate Task Record
請生成 record.md 檔案（位於 pog-task/list/record/{task-uuid}/record.md），內容包含：
- Original Prompt
- Task 目標
- Execution Plan / Checklist
- 相關參考文件
```

## Task 目標

1.  發布 POG Task Manager 1.0.1 版本。
2.  更新相關版本文檔 (`package.json`, `CHANGELOG.md`, `README.md`)。
3.  建立 Plugin 開發者手冊 (`DEVELOPMENT.md`)，規範專案結構與打包流程。

## Execution Plan / Checklist

- [x] Create Task in `common-improve-task.jsonl`
- [x] Create Task Record
- [x] Update Version to 1.0.1
    - [x] `pog-task-manager/package.json`
    - [x] `pog-task-manager/CHANGELOG.md`
    - [x] `CHANGELOG.md`
    - [x] `pog-task-manager/README.md`
    - [x] `README.md` (if applicable)
- [x] Create Developer Guide
    - [x] Create `pog-task-manager/DEVELOPMENT.md`
    - [x] Include Project Structure
    - [x] Include `vsce package` instructions

## 相關參考文件

- `pog-task-manager/package.json`
- `CHANGELOG.md`
