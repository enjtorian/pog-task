# Task Record: POG Task Manager Plugin 優化

## 📋 任務資訊

- **Task ID**: 702d661e-35f2-471d-a868-a54d7b6f1c8c
- **Parent Task**: 9d8f6c3a-2e1b-4f5a-8b3c-1d5e7f9a2b4c (設計 POG Task Manager Plugin 任務管理功能)
- **建立時間**: 2026-02-06T00:00:00+08:00
- **狀態**: pending
- **優先級**: medium
- **預估時數**: 3 小時

## 📝 原始 Prompt

```markdown
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
- parent task id: 9d8f6c3a-2e1b-4f5a-8b3c-1d5e7f9a2b4c

# Step 3: 理解任務 本次任務：
1. POG Task Manager Plugin 優化：右上角增加 collapse 功能，讓使用者可以選擇性隱藏 Task Detail 區塊。
2. POG Task Manager Plugin 優化：設計 filter 功能，讓使用者可以根據 Task 狀態（如 completed、in-progress、pending）來篩選顯示的任務列表。

# Step 4: Generate Task Record
請生成 record.md 檔案（位於 pog-task/list/record/{task-uuid}/record.md），內容包含：
- Original Prompt
- Task 目標
- Execution Plan / Checklist
- 相關參考文件
---
```

## 🎯 任務目標

### 功能 1：Task Detail Webview Collapse 功能
在 Task Detail Webview 的右上角增加 collapse/expand 按鈕，讓使用者可以：
- 隱藏 Task Detail 區塊，以節省螢幕空間
- 展開 Task Detail 區塊，查看完整資訊
- 記住使用者的展開/收合狀態（可選）

### 功能 2：Task 狀態 Filter 功能
在 Task Tree View 中實作篩選功能，讓使用者可以：
- 根據 Task 狀態（pending, in_design, in_planning, in_progress, in_review, blocked, completed, cancelled）進行篩選
- 支援多選狀態篩選
- 提供清除篩選功能
- 在 UI 上顯示目前的篩選狀態

## 📊 執行計畫

### Phase 1: Task Detail Collapse 功能 (1 小時)

1. **Webview UI 設計**
   - 在 Webview header 區域新增 collapse/expand 圖示按鈕
   - 設計 collapsed 狀態的 UI（顯示基本資訊：Task Title + Status）
   - 設計 expanded 狀態的 UI（完整 Task Detail）

2. **狀態管理**
   - 在 Webview 中實作 collapse state
   - 實作 toggle 功能（點擊切換展開/收合）
   - （可選）使用 VS Code context 儲存狀態

3. **Extension 端整合**
   - 處理 Webview 的 collapse/expand 訊息
   - 確保狀態正確同步

### Phase 2: Task 狀態 Filter 功能 (2 小時)

1. **Filter UI 設計**
   - 在 Task Tree View 上方增加 Filter Bar / 按鈕
   - 設計 Filter 選單（Multi-select checkboxes）
   - 狀態選項：
     - ✅ Pending
     - 🔄 In Progress
     - 👀 In Review
     - 🚫 Blocked
     - ✔️ Completed
     - ❌ Cancelled

2. **Filter 邏輯實作**
   - 在 TaskStore 或 TreeDataProvider 中實作 filter 邏輯
   - 支援多狀態組合篩選
   - 實作 "Clear Filter" 功能

3. **TreeDataProvider 整合**
   - 修改 `getChildren()` 方法以支援篩選
   - 確保 refresh 時正確套用 filter
   - 在 Tree View 顯示當前 filter 狀態（如：Filtered by: pending, in_progress）

4. **Commands 整合**
   - 註冊 filter 相關 commands
   - 整合至 package.json 的 commands 與 menus

### Phase 3: 測試與優化

1. **功能測試**
   - 測試 collapse/expand 切換
   - 測試各種 filter 組合
   - 測試 filter + collapse 的組合使用

2. **UI/UX 優化**
   - 確保動畫流暢
   - 檢查 accessibility
   - 優化效能（大量 tasks 的情況）

## 📚 相關參考文件

### 已實作的相關功能
- Task ID `d3e4f5a6-b7c8-9d0e-1f2a-3b4c5d6e7f8g`: POG Task Manager Plugin 實作：Task Explorer View (UI)
  - Checklist 中提到「實作 Filter 邏輯與介面」但標記為 `completed: false`
  - 本任務將完成這項未完成的功能

- Task ID `e4f5a6b7-c8d9-0e1f-2a3b-4c5d6e7f8g9h`: POG Task Manager Plugin 實作：Webview Detail Editor
  - 已實作基本的 Webview 結構
  - 本任務將在此基礎上增加 collapse 功能

### 需要查看的原始碼檔案
- `pog-task-manager/src/ui/taskTreeView.ts` - Tree View 實作
- `pog-task-manager/src/ui/taskWebviewPanel.ts` - Webview 實作
- `pog-task-manager/src/core/taskStore.ts` - 資料層
- `pog-task-manager/package.json` - Commands 定義

### VS Code Extension API 參考
- TreeDataProvider API
- Webview API
- Commands & Menus

## ✅ Checklist

- [ ] 實作 Task Detail Webview Collapse 功能
- [ ] 設計 Filter UI 介面（Tree View）
- [ ] 實作 Filter 邏輯（支援多狀態篩選）
- [ ] 整合 Filter 與 TreeDataProvider

## 📌 注意事項

1. **依賴關係**: 本任務依賴於 `e4f5a6b7-c8d9-0e1f-2a3b-4c5d6e7f8g9h` (Webview Detail Editor)，需確保該功能已完成
2. **一致性**: Filter 的狀態選項應與 JSONL 中定義的狀態完全一致
3. **效能**: 在處理大量 tasks 時，filter 邏輯需要保持高效
4. **用戶體驗**: Collapse 和 Filter 功能應該直覺且易用

## 🔗 相關 Tasks

- Parent: `9d8f6c3a-2e1b-4f5a-8b3c-1d5e7f9a2b4c` - 設計 POG Task Manager Plugin 任務管理功能
- Dependency: `e4f5a6b7-c8d9-0e1f-2a3b-4c5d6e7f8g9h` - Webview Detail Editor
