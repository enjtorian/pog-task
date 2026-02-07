# Task Record: POG Task Manager 設計：目錄參數化

## Original Prompt

```
把 pog-task/list 的目錄 設計成參數化
```

## 設計規劃

### 2.6 目錄參數化設計 (Parameterized Task Directory)

為支援多專案 (Multi-root workspaces) 與彈性配置，`pog-task/list` 的路徑不應寫死。

*   **配置設定 (Configuration)**:
    *   `pog.taskManager.taskDirectories`: 陣列設定，允許使用者指定多個任務存放目錄。
    *   預設值：`["./pog-task/list"]` (相對於 Workspace Root)。
*   **動態載入**:
    *   Extension 啟動時讀取設定，並對所有指定目錄建立 FileSystemWatcher。
    *   Task Explorer 應在 Root 層級增加 "Directory" 或 "Workspace" 節點以區分來源（若有多個目錄）。
*   **變數支援**:
    *   支援 `${workspaceFolder}` 等變數解析。
