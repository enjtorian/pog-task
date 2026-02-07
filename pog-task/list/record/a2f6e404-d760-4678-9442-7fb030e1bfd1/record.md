# 建立 # AGENTS.md for project pog-task-manager

## Original Prompt

```
建立一個 # AGENTS.md for project pog-task-manager
```

## Task 目標

為 `pog-task-manager` 專案建立 `AGENTS.md` 文件，定義 Agent 的工作規範與配置。

## Execution Plan / Checklist

- [x] 1. 建立 `pog-task/list/record/a2f6e404-d760-4678-9442-7fb030e1bfd1/record.md`
- [x] 2. 建立 `AGENTS.md` 檔案 (pog-task-manager/AGENTS.md)
- [x] 3. Refine `AGENTS.md` with deep technical details

## 相關參考文件

- `pog-task/pog-task-agent-instructions.md`
- `pog-task/declare.jsonl`
- `pog-task-manager/src/core/store.ts`
- `pog-task-manager/src/ui/taskWebviewPanel.ts`

## Execution Result

- Created `pog-task-manager/AGENTS.md` with standard guidelines for Agents.
- [2026-02-05] Analyze codebase (`src/core`, `src/ui`) and updated `AGENTS.md` with:
    - Detailed Tech Stack
    - Architecture Overview (Store-Observer pattern)
    - Key Component descriptions (`TaskStore`, `TaskWebviewPanel`, `TaskWatcher`)
    - Project Structure map
