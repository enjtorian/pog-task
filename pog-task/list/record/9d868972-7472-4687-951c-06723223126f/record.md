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
1. 把  **"POG Task Manager"** in the VS Code Extension Marketplace 已經成功上架！ 把以下網址 快速找到 放到所有重要文件中
https://marketplace.visualstudio.com/items?itemName=enjtorian.pog-task-manager
README.md, docs/quickstart.md, docs/index.md, docs/faq.md, 
docs/zh-tw/quickstart.md, docs/zh-tw/index.md, docs/zh-tw/faq.md, 
pog-task/README.md

2. pog-task-manager/README.md 加入 重要檔案 的 git 超連結
pog-task-agent-instructions.md
declare.jsonl

3. 在 pog-task-manager 加入一個 Commnad : Init POG Task 
    功能： 從 git 取得 pog-task-agent-instructions.md, declare.jsonl
       建立 pog-task/ 目錄與 擺放正確位置
       建立 pog-task/list/alpha-activate-task.jsonl 包含第一個 json : {"type": "metadata"}

# Step 4: Generate Task Record
請生成 record.md 檔案（位於 pog-task/list/record/{task-uuid}/record.md），內容包含：
- Original Prompt
- Task 目標
- Execution Plan / Checklist
- 相關參考文件
```

## Task 目標

1.  更新專案文檔，推廣 VS Code Extension Marketplace 連結。
2.  優化 `pog-task-manager` README，加入核心定義檔的 Git 連結。
3.  實作 `Init POG Task` 指令，降低使用者與 Agent 的初始設定門檻。
4.  補充 `Init POG Task` 的使用說明至文檔中。
5.  在 `pog-task-agent-instructions.md` 中加入 Agent 操作建議。

## Execution Plan / Checklist

- [x] Create/Join Task in `common-improve-task.jsonl`
- [x] Create Task Record in `pog-task/list/record/{uuid}/record.md`
- [x] Documentation Updates
    - [x] Update Marketplace URL in `README.md`
    - [x] Update Marketplace URL in `docs/quickstart.md`
    - [x] Update Marketplace URL in `docs/index.md`
    - [x] Update Marketplace URL in `docs/faq.md`
    - [x] Update Marketplace URL in `docs/zh-tw/quickstart.md`
    - [x] Update Marketplace URL in `docs/zh-tw/index.md`
    - [x] Update Marketplace URL in `docs/zh-tw/faq.md`
    - [x] Update Marketplace URL in `pog-task/README.md`
    - [x] Add Git links to `pog-task-manager/README.md`
- [x] Implement `Init POG Task` Command
    - [x] functionality to fetch files from git
    - [x] functionality to create directories and files
    - [x] Register command in `pog-task-manager`
- [x] Verification
    - [x] Verify documentation links
    - [x] Verify command execution
- [x] Document `Init POG Task` Command usage
    - [x] Update `pog-task-manager/README.md`
    - [x] Update `docs/quickstart.md`
    - [x] Update `docs/zh-tw/quickstart.md`
- [x] Add Agent Operation Suggestions to `pog-task-agent-instructions.md`

## 相關參考文件

- `pog-task/pog-task-agent-instructions.md`
- `pog-task/declare.jsonl`
