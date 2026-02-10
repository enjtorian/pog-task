# POG Task Manager

This is a VS Code extension specifically designed for managing POG Tasks (`pog-task/list/**/*.yaml`). It aims to help developers and LLM Agents collaborate efficiently by providing an intuitive interface to view, manage, and track project tasks.

## 🧩 Prompt Orchestration Governance (POG)

### Prompt Orchestration Governance (POG)
A comprehensive framework for managing prompts as first-class software assets throughout the Software Development Life Cycle (SDLC). POG provides systematic processes for discovering, normalizing, validating, versioning, and deploying prompts while maintaining governance and quality controls.

📖 **Whitepaper**: [Prompt Orchestration Governance Whitepaper](https://enjtorian.github.io/prompt-orchestration-governance-whitepaper/)

---

## Core Concept: What is a POG Task?

> **From human intent to Agent-executable work.**

POG Task is an AI-native task governance model that treats tasks as structured, interpretable, and auditable Units of Intention.

Beyond just a to-do list, POG Task emphasizes:
*   **Structured Stream**: Stored in YAML format, AI-friendly, and easy to parse.
*   **Reasoning Trace**: Records the Agent's thinking process and execution details through `record.md`.
*   **Human-Agent Collaboration**: Clearly distinguishes between human "intent definition" and Agent "execution and reasoning."

This extension is designed for seamless collaboration with the POG Task system within VS Code, allowing you to easily manage these structured intentions.

## Architecture

The system relies on a file-based, Git-friendly structure that supports transparency and portability.

### Repository Structure

```
pog-task/
├── pog-task-agent-instructions.md # Agent operating guide
├── pog-task-design.md             # System design documentation
├── list/                          # Active task database
│   └── {project}/
│       └── {module}/
│           ├── {task}.yaml        # Structured task (AI-readable)
│           └── record/            # Execution artifacts
│               └── {uuid}/        # Unique folder for each task
│                   └── record.md  # Execution and reasoning trace
```

### Why File-Based?
*   **Git Integration**: Leverages the most time-tested versioned memory system.
*   **Common Language**: Markdown and YAML are native "lingua franca" for humans and LLMs.
*   **Portability**: Zero lock-in. Works with VS Code, CI/CD, Agent frameworks, or any text editor.

### Components

#### 1. Task Stream (`*.yaml`)
Tasks are stored in YAML files, organized in a hierarchical directory. For directory structure and naming conventions, please refer to `pog-task/README.md` or `pog-task/pog-task-design.md`.

#### 2. Reasoning Record (`record.md`)
For complex tasks, the `record.md` file acts as the "brain" of the execution process. It captures the Agent's thinking, the original user prompt, and the evolution of the plan. This is crucial for debugging Agent behavior and ensuring intent alignment.

#### 3. VS Code Plugin (Optional Interface)
This plugin is an interface, not the core. it is used to visualize the `task.yaml` stream, assist humans in writing AI-friendly tasks, and inspect execution records.

## Workflow

### 1. Defining Intent
A human (or Agent) creates a task in a `*.yaml` file. It defines the objective, priority, and initial context.

### 2. Assignment & Claiming
An Agent (or human) identifies pending tasks and "claims" them by updating the task status and assigning it to themselves. This avoids conflicts in multi-agent environments.

### 3. Execution & Reasoning
The Agent creates `record.md` to document its plan. It executes the work (coding, research, etc.) and updates the record accordingly.

### 4. Completion & Verification
Once finished, the Agent marks the task as completed in the YAML file and finalizes the record. Humans can review `record.md` to verify not just the output, but the process itself.

## Features

### 1. Task List Management

Provides an intuitive sidebar Tree View, automatically grouping and displaying tasks by Project and Module. Supports rich status icons and hierarchical expansion for an at-a-glance project overview.

![Task List](https://github.com/enjtorian/pog-task/raw/HEAD/pog-task-manager/assets/Detail-Plugin-Task-List.png)

*   **Real-time Monitoring**: Automatically listens for changes in `pog-task/list/**/*.yaml` files; new or modified tasks are immediately reflected in the list.
*   **Status Filtering**: Filter tasks by specific states (e.g., In Progress, Pending).

### 2. Agent Collaboration Integration (Prompt Templates)

Built-in Agent Prompt Template management for various scenarios (e.g., creating new tasks, executing existing tasks), providing standardized prompts.

![Prompt Templates](https://github.com/enjtorian/pog-task/raw/HEAD/pog-task-manager/assets/Detail-Plugin-Prompt-Templates.png)

*   **One-click Copy**: Quickly generate and copy Agent instructions to paste directly into your LLM.
*   **Context Injection**: Automatically integrates the task context into the prompt.

### 3. Task Detail & Record

*   **Webview Editor**: View and edit task details through a form interface.
*   **Record Access**: Quickly open the corresponding `record.md` for a task to inspect the execution process and reasoning logs.

## Agent Prompt Usage Guide

POG Task Manager provides two main prompt generation functions to help you quickly start collaborating with Agents:

### 1. Create Prompt
Used for creating a new task from scratch.
*   **When to use**: When you have a new idea or requirement and need an Agent's help to transform it into a formal POG Task.
*   **Generated Content**: Includes reading the [Agent Guide](https://github.com/enjtorian/pog-task/blob/main/pog-task/pog-task-agent-instructions.md), category definition, and standard steps for creating the task and `record.md`.
*   **How to operate**: Select "Create Task" from the Prompt Templates list, or right-click in an empty area of the task list and select "Copy Create Prompt."

"Copy Create Prompt" Example:
---
    # Step 1: Read Context
    Please read the following documents and relevant resources:
    - pog-task/pog-task-agent-instructions.md
    - pog-task/task.schema.json

    # Step 2: Create or Join Task
    Please operate under pog-task/list:
    - project: {${project}}
    - module: {${module}}
    - If task does not exist → Create new task
    - If task already exists → Join the task
    - parent task id: {task.parent_task}

    # Step 3: Understand Task
    This task:
        xxxxxxxx

    # Step 4: Generate Task Record
    Please generate a record.md file (located at pog-task/list/{project}/{module}/record/{task-uuid}/record.md), containing:
    - Original Prompt
    - Task Objective
    - Execution Plan / Checklist
    - Relevant reference documents
---

### 2. Execute Prompt
Used for executing an existing task.
*   **When to use**: When a task has already been created (in Pending or In Progress status) and you want to assign an Agent to start the actual work.
*   **Generated Content**:
    *   **Context**: Automatically includes the YAML file path and the corresponding `record.md` path.
    *   **Instruction**: Explicitly tells the Agent to execute a specific task ID and update status and progress.
*   **How to operate**: Right-click on a specific task in the task list and select "Copy Execute Prompt."

"Copy Execute Prompt" Example:
---
    # Step 1: Read Context
    Please read the following documents and relevant resources:
    - pog-task/pog-task-agent-instructions.md
    - pog-task/list/${filename}
    - pog-task/list/${project}/${module}/record/${task.id}/record.md

    # Step 2: Execute Task
    Please execute the specified task in pog-task/list/${filename}:
    - task id: ${task.id}

    # Step 3: Update Progress
    - Update status: in_progress → in_review
    - Update checklist / notes / actual_hours
    - Add execution record in history
    - Record key decisions and outputs in record.md
---

## Usage

1.  **Project Structure Preparation**:
    Ensure there is a `pog-task/list/` directory in your project root, containing `.yaml` files that follow the POG Task specification (e.g., `common/improve/task.yaml`).

2.  **Launching and Browsing**:
    After installing the extension, click the POG Task Manager icon in the VS Code Activity Bar to open the task list.

3.  **Common Operations**:
    *   **Refresh Tasks**: Use `POG Task Manager: Refresh Tasks` in the Command Palette to manually force a reload of all tasks.
    *   **Context Menu**: Right-click on a task item to perform actions like copying prompts, opening records, or toggling status.
    *   **Init POG Task**: Use `POG Task Manager: Init POG Task` in the Command Palette to quickly initialize the project structure.
