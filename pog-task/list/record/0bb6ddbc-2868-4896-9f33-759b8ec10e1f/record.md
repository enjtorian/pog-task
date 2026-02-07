# POG Task Manager Plugin 優化：功能擴展與 Prompt Template 整合

## Original Prompt

```
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
    Task: POG Task Manager Plugin 優化： 任務
    1. 先幫我思考 在目前 POG Task Manager Plugin 中 的功能 接著往上可以增加哪些好用的 功能
    2. 針對 .github/prompts/ 底下有的 Prompt Template 可以做 list 
        在 plugin 中 切下面的 區塊 放
        提供 快速 複製加上這個 Prompt Template 的功能

# Step 4: Generate Task Record
請生成 record.md 檔案（位於 pog-task/list/record/{task-uuid}/record.md），內容包含：
- Original Prompt
- Task 目標
- Execution Plan / Checklist
- 相關參考文件
---
```

## Task 目標

### 主要目標
1. **功能擴展分析**：分析當前 POG Task Manager Plugin 的功能，提出實用的改進建議
2. **Prompt Template 整合**：實作 Prompt Template 列表與快速複製功能

### 具體產出
- [ ] 當前功能分析報告與改進建議清單
- [ ] Prompt Template 列表介面設計
- [ ] 快速複製 Prompt Template 功能實作

## Execution Plan / Checklist

### Phase 1: 現有功能分析 🔍
- [x] 閱讀 `pog-task/pog-task-agent-instructions.md`
- [x] 閱讀 `pog-task/declare.jsonl`
- [x] 檢視現有任務結構
- [ ] 分析 POG Task Manager Plugin 當前功能
- [ ] 整理功能清單與使用情境

### Phase 2: 功能改進建議 💡
- [ ] 基於使用者工作流程提出改進建議
- [ ] 評估功能優先級與實作複雜度
- [ ] 撰寫功能建議文檔

### Phase 3: Prompt Template 功能設計 📋
- [x] 列出 `.github/prompts/` 下的所有 Prompt Template
- [ ] 設計 Prompt Template 列表 UI
  - [ ] 在 Webview 或 Tree View 中新增專區
  - [ ] 支援分類與搜尋
- [ ] 設計快速複製功能
  - [ ] 一鍵複製功能
  - [ ] 與當前任務資訊結合的智能填充

### Phase 4: 功能實作 ⚙️
- [x] 實作 Prompt Template 資料讀取
- [x] 實作 UI 元件
- [x] 實作複製到剪貼簿功能
- [x] 測試與驗證
- [x] 編譯成功

## 實作成果

### 新增檔案
- ✅ `src/core/promptTemplateStore.ts` - Prompt Template 資料管理
- ✅ `src/ui/promptTemplateTreeView.ts` - Tree View Provider
- ✅ `src/commands/promptTemplateCommands.ts` - 複製、預覽、開啟指令

### 修改檔案
- ✅ `package.json` - 新增 views, commands, menus, configuration
- ✅ `src/extension.ts` - 註冊所有 Prompt Template 元件

### 編譯結果
- ✅ Webpack 編譯成功 (63.4 KiB)
- ✅ 無語法錯誤
- ✅ 偵測到 11 個 Prompt Templates

## 相關參考文件

### 核心文檔
- [pog-task/pog-task-agent-instructions.md](file:///Users/ted/ES-Disk/POG/github/pog-task/pog-task-agent-instructions.md) - Agent 操作指南
- [pog-task/declare.jsonl](file:///Users/ted/ES-Disk/POG/github/pog-task/declare.jsonl) - Category 定義
- [pog-task/list/common-improve-task.jsonl](file:///Users/ted/ES-Disk/POG/github/pog-task/list/common-improve-task.jsonl) - 現有任務清單

### Prompt Templates 清單
位於 `.github/prompts/` 目錄：
1. `awesome-copilot/create-agentsmd.prompt.md`
2. `awesome-copilot/create-readme.prompt.md`
3. `awesome-copilot/folder-structure-blueprint-generator.prompt.md`
4. `awesome-copilot/project-workflow-analysis-blueprint-generator.prompt.md`
5. `awesome-copilot/readme-blueprint-generator.prompt.md`
6. `webcomm.analyze.parser.architecture.prompt.md`
7. `webcomm.create.service.h2.test.prompt.md`
8. `webcomm.generate.diagram.blog.series.prompt.md`
9. `webcomm.generate.diagram.slides.prompt.md`
10. `webcomm.implement.from.specs.prompt.md`
11. `webcomm.save.prompt.prompt.md`

### 父任務
- Parent Task ID: `9d8f6c3a-2e1b-4f5a-8b3c-1d5e7f9a2b4c`
- Title: 設計 POG Task Manager Plugin 任務管理功能

### 相關子任務
已完成的相關任務：
- `b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e` - 專案初始化
- `c2d3e4f5-a6b7-8c9d-0e1f-2a3b4c5d6e7f` - Task Data Service
- `d3e4f5a6-b7c8-9d0e-1f2a-3b4c5d6e7f8g` - Task Explorer View
- `e4f5a6b7-c8d9-0e1f-2a3b-4c5d6e7f8g9h` - Webview Detail Editor
- `f5a6b7c8-d9e0-1f2a-3b4c-5d6e7f8g9h0i` - Agent Integration
- `i8a9b0c1-d2e3-4f5a-6b7c-8d9e0f1g2h3i` - Agent Prompt 生成
- `j9a0b1c2-d3e4-4f5a-6b7c-8d9e0f1g2h3i` - Prompt 區分 Create/Execute

## 任務資訊

- **Task ID**: `0bb6ddbc-2868-4896-9f33-759b8ec10e1f`
- **Category**: `feature`
- **Priority**: `medium`
- **Status**: `in_progress`
- **Created**: 2026-02-05T11:01:39+08:00
- **Estimated Hours**: 3
- **Claimed By**: antigravity
