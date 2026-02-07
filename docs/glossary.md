# Glossary

Comprehensive definitions of terms used in the POG Task.

---

## Core Concepts

### Prompt Orchestration Governance (POG)
A comprehensive framework for managing prompts as first-class software assets across the Software Development Life Cycle. POG provides systematic processes for discovering, normalizing, validating, versioning, and deploying prompts while maintaining governance and quality controls.

### POG Task
An AI-native task unit treated as a "Unit of Intention". Unlike traditional free-form tasks, a POG Task is structured (JSONL), machine-readable, auditable (via `record.md`), and governed by strict protocols. It constrains agent autonomy while enabling collaboration by ensuring that if a task cannot be interpreted and executed deterministically by an AI agent, it is not a task.

### Unit of Intention
A core concept in POG Task where a task is treated as a structured, machine-readable, and agent-governed entity, rather than just free-form text. It ensures that the goal is explicit, constrained, and unambiguous for AI execution.

### Structured Stream
The use of deterministic JSONL format (`pog-task/list/*.jsonl`) to represent the state and history of tasks. This format is optimized for machine parsing and efficient appending, serving as the "backbone" of the task system.

### Reasoning Log (`record.md`)
A dedicated Markdown file specific to each task (stored in `pog-task/list/record/{uuid}/`) that captures the "why" behind an Agent's actions. It includes the original prompt, execution plan, decision reasoning, timeline, and links to artifacts.

### Governance Layer
The standardized system in POG that ensures all AI actions are structured, logged, and auditable. It acts as a safety boundary, managing how agents create tasks, claim work, and record their outputs.

### Audit Trail
The complete, verifiable history of a task, combining the state changes in the JSONL stream with the detailed reasoning in `record.md`. This allows humans to review, debug, and verify every step of an AI's work.

### Handoff Contract
The explicit agreement formed when an Agent "claims" a task. By updating the task status to `in_progress` and setting `claimed_by`, the Agent accepts the intent defined in the task and commits to executing it according to the protocol.

### Side Effects
Changes made by an AI Agent to the code, system configurations, or data. In POG, these are strictly governed and must be explicitly logged and traceable back to a specific task and reasoning process.

### POG Task Manager
A tool (such as the VS Code Extension) that serves as the human interface for the POG ecosystem. It allows users to visualize task streams, manage task lifecycles (create, update), and review agent reasoning logs (`record.md`) in a user-friendly manner, bridging the gap between human intent and machine execution.
