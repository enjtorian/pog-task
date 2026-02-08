# Task Record: 重構說明文件以符合 YAML 設計

## Original Prompt
---
# Step 1: Read Context
請閱讀以下文件及相關資源：
- pog-task/pog-task-agent-instructions.md
- pog-task/task.schema.json

# Step 2: Create or Join Task
請在 pog-task/list 下操作：
- project: {common}
- module: {refactoring}
- 如果任務不存在 → 新建任務
- 如果任務已存在 → 加入該任務
- parent task id: {task.parent_task}

# Step 3: 理解任務 本次任務：
依照目前 jsonl 調整成 yaml 的設計 重構整個 說明文件 
    檢查 root 所有的檔案
    檢查 docs 所有的檔案
    閱讀 pog-task/README.md 
        以最新的 資料結構 更新檔案 與說明
        確保 移除 declare.jsonl 

# Step 4: Generate Task Record
請生成 record.md 檔案（位於 pog-task/list/common/refactoring/record/{task-uuid}/record.md），內容包含：
- Original Prompt
- Task 目標
- Execution Plan / Checklist
- 相關參考文件
---

## Task 目標
依照最新的 YAML 任務管理設計，重構全域說明文件，確保所有文件內容與最新的資料結構（YAML 替代 JSONL）一致，並移除過時的 `declare.jsonl` 配置。

## Execution Plan / Checklist
- [x] **Research and Analysis**
    - [x] 掃描 `pog-task/` 核心目錄下的所有 Markdown 檔案，辨別過時的 JSONL 引用。
    - [x] 掃描 `docs/` 目錄下的所有文件 (包含不同語言版本)，確認是否提及 `declare.jsonl` 或 JSONL 格式。
    - [x] 詳細閱讀 `pog-task/README.md`，提取最新的資料結構說明。
- [x] **Implementation**
    - [x] 更新 `pog-task/README.md`：移除對 `declare.jsonl` 的說明，改為 YAML 目錄結構說明。
    - [x] 更新 `pog-task/pog-task-design.md` (如有)：確保設計文件符合現狀。
    - [x] 移除或更新專案中任何殘留的 `declare.jsonl` 檔案。
    - [x] 修正 `docs/` 下受影響的快速入門或開發手冊內容。
- [x] **Verification**
    - [x] 執行 `python3 pog-task.py` 驗證現有 YAML 檔案是否符合 Schema。
    - [x] 使用 `grep` 搜尋整個專案，確保不再出現 `declare.jsonl` 字眼。

## 相關參考文件
- [pog-task-agent-instructions.md]
- [task.schema.json]
- [重構說明文件以符合 YAML 設計.yaml]
