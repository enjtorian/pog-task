# Task Record: 完善 POG Task Manager README 文件

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
    修改 pog-task-manager/README.md 目標 完整的說明 POG Task Manager 的功能
    加入圖片：pog-task-manager/Detail-Plugin-Task-List.png, pog-task-manager/Detail-Plugin-Prompt-Templates.png
    從 VS code Extensions 取得後的說明 所以移除 安裝部署什麼的
    加入對於 POG Task 的說明 參考：POG-Task.zh-tw.md

# Step 4: Generate Task Record
請生成 record.md 檔案（位於 pog-task/list/record/{task-uuid}/record.md），內容包含：
- Original Prompt
- Task 目標
- Execution Plan / Checklist
- 相關參考文件
```

### Additional Request (Architecture & Workflow)

```
補充這些內容進去： ## 架構 ... ## 工作流 ...
(Full text in task execution history)
```

### Additional Request (Prompt Usage from agentCommands.ts)

```
參考 agentCommands.ts 把 prompt 初步使用加入到 README.md
```

## Task 目標

1.  **完善文件**：將 `pog-task-manager/README.md` 修改為適合終端使用者的說明文件。
2.  **移除開發內容**：移除「安裝方式」與「開發與測試」等針對開發者的章節。
3.  **增加功能說明**：詳細說明插件功能（Task List, Prompt Templates 等）。
4.  **加入視覺輔助**：插入指定截圖 (`Detail-Plugin-Task-List.png`, `Detail-Plugin-Prompt-Templates.png`)。
5.  **整合核心概念**：參考 `POG-Task.zh-tw.md` 加入 POG Task 的概念說明，以及詳細的「架構」與「工作流」說明。
6.  **說明 Agent Prompt 用法**：參考 `agentCommands.ts` 說明如何產生與使用 Prompt。

## Execution Plan / Checklist

- [x] 建立任務與 Record 檔案
- [x] 閱讀並理解 `pog-task-manager/README.md` 現狀
- [x] 閱讀 `POG-Task.zh-tw.md` 提取關鍵概念
- [x] 修改 `pog-task-manager/README.md`
    - [x] 移除開發者安裝指南
    - [x] 撰寫 POG Task 概念簡介
    - [x] 加入「架構」與「工作流」章節
    - [x] 撰寫 Task List 功能說明與插入圖片
    - [x] 撰寫 Prompt Templates 功能說明與插入圖片
    - [x] 整理 Usage 章節
    - [x] 加入 Agent Prompt 初步使用說明
- [x] 預覽與校對

## 相關參考文件

- `pog-task/pog-task-agent-instructions.md`
- `pog-task/declare.jsonl`
- `pog-task-manager/README.md`
- `pog-task/POG-Task.zh-tw.md`
- `pog-task-manager/src/commands/agentCommands.ts`

## 執行細節

- 任務建立於 `common-improve-task.jsonl` (UUID: `0194e8c1-7f32-7234-8c43-8f0a2e5d9b1c`)。
- README 已更新為使用者導向版本，強調 POG Task 概念、架構、工作流與插件功能。
- 已確認圖片路徑正確指向 `images/` 目錄。
