# Agent Guidelines for POG Task Manager

This document defines the technical architecture, coding standards, and workflows for autonomous agents working on the **POG Task Manager** VSCode extension.

## 🤖 Project Overview

**POG Task Manager** is a VSCode extension that provides a GUI for managing tasks defined in `*.jsonl` files. It adheres to the "Prompt Orchestration Governance" (POG) methodology, bridging human intent (Tasks) with Agent execution.

## 🛠 Tech Stack

- **Core**: TypeScript (VSCode Extension API)
- **UI**:
    - **Tree View**: `vscode.TreeDataProvider`
    - **Task Details**: Webview (Raw HTML/JS with message passing)
- **Data Persistence**: JSONL (Newline Delimited JSON)
- **Build System**: Webpack, ESLint

## 🏗 Architecture

The project follows a **Store-Observer** pattern to ensure data consistency across multiple UI views.

### 1. Data Layer (`src/core/`)

- **`TaskStore`** (`src/core/store.ts`):
    - The **Single Source of Truth**.
    - Loads `.jsonl` files from configured directories (`pog.taskManager.taskDirectories`).
    - Parses files using `JsonlParser` (`src/core/parser.ts`).
    - Maintains an in-memory `Map` of tasks.
    - Handles data relationships (Project/Module grouping, Parent/Child hierarchy).
    - Emits `onDidUpdate` event when data changes.

- **`TaskWatcher`** (`src/core/watcher.ts`):
    - Uses `vscode.FileSystemWatcher` to monitor `.jsonl` changes.
    - Triggers `store.load()` on file change/create/delete.

- **`Types`** (`src/core/types.ts`):
    - Defines the Schema: `Task`, `TaskMetadata`, `TaskHistory`.
    - STRICTLY matches the JSONL file format.

### 2. UI Layer (`src/ui/`)

- **`TaskTreeDataProvider`** (`src/ui/taskTreeDataProvider.ts`):
    - Implements `vscode.TreeDataProvider`.
    - Subscribes to `store.onDidUpdate`.
    - Renders the "Task List" side bar view.
    - Hierarchy: `Project` -> `Module` -> `Task` -> `Subtask`.

- **`TaskWebviewPanel`** (`src/ui/taskWebviewPanel.ts`):
    - Renders the "Task Details" editor.
    - Uses a Singleton pattern (`currentPanel`) to manage the visible editor.
    - **Bi-directional Communication**:
        - **To Webview**: Sends HTML content with Task data.
        - **From Webview**: Receives `updateTask`, `openFile`, `copyExecutePrompt` messages.
    - **Record.md Integration**: Auto-discovers and links to `pog-task/list/record/{uuid}/record.md`.

### 3. Command Layer (`src/commands/`)

- Separated command handlers for cleaner `extension.ts`.
- **`agentCommands.ts`**:
    - `copyCreatePrompt`: Generates a prompt to Create a new task.
    - `copyExecutePrompt`: Generates a prompt for an Agent to Execute a task (includes Context + Plan).
- **`quickAdd.ts`**: Quick pick input for rapid task creation.

## 📂 Project Structure

```
pog-task-manager/
├── src/
│   ├── core/           # Data logic (Store, Types, Parser, Watcher)
│   ├── ui/             # View logic (TreeView, Webview)
│   ├── commands/       # independent command handlers
│   └── extension.ts    # Entry point & Composition Root
├── package.json        # Manifest (Views, Commands, Configuration)
└── AGENTS.md           # This file
```

## 📋 Implementation Workflow for Agents

1.  **Understand the Architecture**:
    - If modifying UI, check `src/ui`.
    - If modifying Data Logic, check `src/core`.
2.  **State Management**:
    - **NEVER** modify `Task` objects directly in the UI.
    - **ALWAYS** use `store.saveTask()` to persist changes to disk.
    - The `TaskWatcher` will auto-reload the Store, triggering a UI refresh.
3.  **Authentication/Secrets**:
    - Does not currently handle secrets. Do not introduce secret storage without user approval.
4.  **Testing**:
    - Run `npm run compile` to catch type errors.
    - Use `console.log` for debugging (visible in Debug Console).

## 🔍 Key Design Rules

- **JSONL Formatting**: When writing to files, ensure valid JSON per line.
- **Webview Security**: Use `vscode.postMessage` for all actions. Escape HTML user input tasks.
- **Performance**: `TaskStore.load()` reads all files. Optimize for < 1000 tasks.

---
*Updated by Agent on 2026-02-05*
