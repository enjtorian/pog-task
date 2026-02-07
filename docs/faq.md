# Frequently Asked Questions (FAQ)

Common questions about POG Task.

---

## General

### What is POG Task?
POG Task is an **AI-native task governance model** designed for environments where AI Agents are first-class participants. It treats tasks as **Units of Intention**—structured, machine-readable, auditable, and agent-governed.

### How is POG Task different from tools like Jira or Trello?
Traditional tools assume humans interpret and execute tasks, which leads to ambiguity for AI. POG Task is designed for AI-first environments:
- **Structure**: Uses structured, deterministic JSONL streams instead of free-form text.
- **Traceability**: Captures decision reasoning and execution in `record.md`.
- **Governance**: Ensures full audit trails and strict control over "side effects".

### What is `record.md`?
`record.md` is an **Execution & Reasoning Log** stored with each task. It captures the "why" behind AI actions, including the original prompt, execution plan, timeline, artifacts, and technical notes, serving as a human-readable audit trail.

### How do AI Agents interact with POG Task?
Agents interact via two main modes:
1.  **Read + Create/Join**: Understanding the protocol and establishing intent.
2.  **Read + Execute**: Claiming tasks, executing steps, updating status, and recording reasoning in `record.md`.

### Who is POG Task for?
It is for organizations using AI-assisted development that need:
- Clear, auditable task history.
- Reduced ambiguity in human-AI collaboration.
- Systematic governance over AI behavior.

## Architecture & Design

### What is the relationship between `task.jsonl` and `record.md`?
`task.jsonl` is the **backbone** of the task stream, where each line represents a task state, optimized for machine reading and retrieval.
`record.md` is the **brain** of the task, storing detailed execution plans, reasoning processes, conversation logs, and artifacts. When a task becomes complex, the Agent thinks and records in `record.md`.

### Why does the project need a specific `pog-task/list/` directory structure?
This allows the POG Task Manager (and Agents) to automatically identify and manage tasks.
- `pog-task/list/*.jsonl`: Active task lists.
- `pog-task/list/record/{uuid}/`: Exclusive folder for each task, containing `record.md`.

## VS Code Extension

### What core features does POG Task Manager provide?
- **Task List**: Automatically groups and displays all POG Tasks in the project, supporting status filtering and real-time updates.
- **Prompt Templates**: Built-in standard prompt templates like "Create Task" and "Execute Task" for one-click copying to Agents.
- **Task Detail**: Provides a graphical interface to view and edit task attributes.
- **Record Access**: Quickly open and edit the corresponding `record.md`.

### How do I manually refresh the task list?
The extension automatically watches for file changes. However, in rare cases, you can use the Command Palette (`Cmd+Shift+P`) and enter `POG Task Manager: Refresh Tasks` to force a reload.

## Agent Collaboration

### What is the "Create Task" Prompt?
Used when you want to start a new task from scratch. It instructs the Agent to:
1.  Read project context and specifications.
2.  Create a new task entry in `.jsonl`.
3.  Initialize `record.md` and fill in the task goal and execution plan.

### What is the "Execute Task" Prompt?
Used when a task already exists (e.g., status is `todo` or `in_progress`) and you want to assign an Agent to execute it. It instructs the Agent to:
1.  Read the task details and `record.md`.
2.  Perform the actual work.
3.  Update task status and progress records.

### How do I get these Prompts?
In the **Task List** of the VS Code extension, right-click on any task to see the `Copy Create Prompt` or `Copy Execute Prompt` options.
