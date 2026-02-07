# Original Prompt

閱讀
    pog-task/pog-task-agent-instructions.md 與其相關的檔案
建立一個 或 加入
    pog-task/list
        project: {common}
        module: {improve}
新增一個任務 並 增加 record.md 規劃：
    修改 Execute Prompt 為以下格式
---
# Step 1: Read Context
請閱讀以下文件及相關資源：
- pog-task/pog-task-agent-instructions.md
- pog-task/list/{common}-{improve}-task.jsonl
- pog-task/list/record/{task-uuid}/record.md

# Step 2: Execute Task
請執行 pog-task/list/{common}-{improve}-task.jsonl 中指定 Task：
- task id: {task-uuid}  (例: h7a8b9c0-d1e2-3f4a-5b6c-7d8e9f0g1h2i)

# Step 3: Update Progress
- 更新 status: in_progress → in_review
- 更新 checklist / notes / actual_hours
- 在 history 中加入執行紀錄
- 在 record.md 中記錄關鍵決策與產出物

---

# Task 目標
修改 Agent Execute Prompt 的生成邏輯，使其符合新的標準化格式（Step 1 到 Step 3），以統一 Agent 的操作流程。

# Execution Plan / Checklist
- [x] 尋找生成 Execute Prompt 的程式碼位置 (`pog-task-manager/src/commands/agentCommands.ts`)
- [x] 修改 Template 字串以符合新格式
  - Step 1: Read Context
  - Step 2: Execute Task
  - Step 3: Update Progress
- [x] 驗證新格式並且編譯

# 相關參考文件
- pog-task/pog-task-agent-instructions.md
- pog-task/declare.jsonl

# Timeline
- 2026-02-05T01:50:00+08:00 created task
- 2026-02-05T01:52:00+08:00 claimed task
- 2026-02-05T01:55:00+08:00 implemented changes
- 2026-02-05T01:56:00+08:00 compiled successfully
