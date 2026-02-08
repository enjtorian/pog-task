# Quick Start

POG Task Manager is a VS Code extension designed to help developers efficiently collaborate with LLM Agents to manage POG Tasks. It provides an intuitive interface to view, manage, and track project tasks, transforming human intent into actionable units of work for Agents.

## Installation

1.  Search for **"POG Task Manager"** in the VS Code Extension Marketplace, or visit the [Marketplace Page](https://marketplace.visualstudio.com/items?itemName=enjtorian.pog-task-manager).
2.  Click install to start using it.

Once installed, you can see the POG Task Manager icon in the VS Code Activity Bar.

## Project Setup

Before using POG Task Manager, ensure your project complies with the POG Task file structure specification:

1.  **Initialize Project**: Open Command Palette (`Cmd+Shift+P`), type `POG Task Manager: Init POG Task` and run it. This will automatically create the `pog-task` directory and download necessary configuration files.
2.  (Manual Alternative) **Create Directory**: Create a `pog-task/list/` folder in the project root directory.
3.  (Manual Alternative) **Create Task File**: Create a `.jsonl` file that complies with the POG Task specification (e.g., `common-improve-task.jsonl`).
4.  (Manual Alternative) **Define Categories**: Create `pog-task/declare.jsonl` to define task categories.

The standard directory structure is as follows:

```
pog-task/
├── declare.jsonl                               # Task category definitions
├── pog-task-agent-instructions.md              # Agent operation guide
├── list/                                       # Active task database
│   ├── task.jsonl                              # Structured task stream (AI readable)
│   └── record/                                 # Execution artifacts
│       └── {uuid}/                             # Unique folder for each task
│           └── record.md                       # Execution and reasoning trace
```

## Core Workflow

POG Task Manager is designed around the collaboration cycle with AI Agents:

### 1. Create Task

When you have a new idea or requirement and need an Agent's help to transform it into a formal POG Task:

1.  Open the POG Task Manager sidebar.
2.  Select **"Create Task"** in the **Prompt Templates** list, or right-click in the empty space of the task list and select **"Copy Create Prompt"**.
3.  Paste the copied instructions to the LLM Agent.
4.  After the Agent executes this instruction, it will help you create a task in the `.jsonl` file and generate an initial `record.md`.

### 2. Execute Task

When a task has been created (status is usually `pending` or `in_progress`) and you want to assign an Agent to start the actual work:

1.  Right-click on the target task in the task list.
2.  Select **"Copy Execute Prompt"**.
3.  Paste the copied instructions to the LLM Agent.
4.  The instruction will automatically include the task context (JSONL content, Record path, etc.), and the Agent will execute the task and update progress based on this.

### 3. View & Manage

*   **Open Record**: Right-click on a task and select **"Open Record"** to open the corresponding `record.md` and view the Agent's thought process, execution plan, and outputs.
*   **Update Status**: You can modify the status directly in the `.jsonl` file, or perform partial operations via the extension interface (such as switching status), and the list will reflect changes in real-time.
*   **Refresh**: If file changes are not immediately displayed, you can click the refresh button at the top of the list or use the command `POG Task Manager: Refresh Tasks`.

## Next Steps

*   Learn more about [Core Concepts](index.md)
*   View [FAQ](faq.md)
