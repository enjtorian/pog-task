# Original Prompt

閱讀
    pog-task/pog-task-agent-instructions.md 與其相關的檔案
建立一個 或 加入
    pog-task/list
        project: {common}
        module: {improve}
新增一個任務 並 增加 record.md 規劃：
    修改 Create Prompt 為以下格式
---
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
    xxxxxxxx

# Step 4: Generate Task Record
請生成 record.md 檔案（位於 pog-task/list/record/{task-uuid}/record.md），內容包含：
- Original Prompt
- Task 目標
- Execution Plan / Checklist
- 相關參考文件
---

# Task 目標
修改 Agent Create Prompt 的生成邏輯，使其符合新的標準化格式（Step 1 到 Step 4），以統一 Agent 的操作流程。

# Execution Plan / Checklist
- [x] 尋找生成 Create Prompt 的程式碼位置 (`pog-task-manager/src/commands/agentCommands.ts`)
- [x] 修改 Template 字串以符合新格式
  - Step 1: Read Context
  - Step 2: Create or Join Task
  - Step 3: 理解任務
  - Step 4: Generate Task Record
- [x] 驗證新格式 (Build Successful)

# 相關參考文件
- pog-task/pog-task-agent-instructions.md
- pog-task/declare.jsonl

# Timeline
- 2026-02-05T01:45:00+08:00 created task
- 2026-02-05T01:47:00+08:00 claimed task
- 2026-02-05T01:52:00+08:00 implemented changes in `agentCommands.ts`
- 2026-02-05T01:53:00+08:00 successfully compiled the extension

# Artifacts
- [agentCommands.ts](file:///Users/ted/ES-Disk/POG/github/pog-task-manager/src/commands/agentCommands.ts)
