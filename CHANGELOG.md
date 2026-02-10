# Changelog

All notable changes to the POG Task project will be documented in this file.

## [1.1.1] - 2026-02-10

### Fixed: Data Loss in `quickAdd`
### Fixed: Config Overwrite & Unverified Download in `initPogTask`

## [1.1.0] - 2026-02-08

### ⚡ `pog-task/` (Core Specification)

*   **Major Refactor**: Fully transitioned from JSONL to **YAML-based** task management.
*   **Structure**: Implemented project/module nested directory structure (`list/{project}/{module}/`).
*   **Documentation**: Global update of all guides, whitepapers, and manuals to reflect the new YAML design.
*   **Cleanup**: Removed all references to `declare.jsonl`.

## [1.0.1] - 2026-02-08

### 🧩 `pog-task-manager/` (VS Code Plugin)

*   **New Feature**:
    *   Added `Init POG Task` command for one-click project initialization.
    *   Automatically fetches `pog-task-agent-instructions.md` and `declare.jsonl` from Git.
*   **Documentation**:
    *   Updated READMEs with VS Code Marketplace link.
    *   Added Developer Guide (`pog-task-manager/DEVELOPMENT.md`).

## [1.0.0] - 2026-02-08

### 📚 `docs/` (Whitepaper & Guides)

*   **Core Documentation**:
    *   Authored comprehensive **Whitepaper** (English & Traditional Chinese) covering philosophy, architecture, and governance models.
    *   Established **Design Principles**: Intent-first, structured state, and auditable execution.
*   **Guides & References**:
    *   Created **Agent Instructions** (`pog-task-agent-instructions.md`) for standardized AI behavior.
    *   Developed **System Design** (`pog-task-design.md`) detailing the JSONL state stream and `record.md` audit logs.
    *   Added **Reference Guides**: **FAQ**, **Glossary**, and **Quickstart** for immediate onboarding.
*   **Localization**:
    *   Translated core documentation (Index, FAQ, Glossary, Quickstart) to **Traditional Chinese (zh-tw)**.
*   **Website**:
    *   Launched documentation site with MkDocs Material theme, deployed via GitHub Pages.

### ⚡ `pog-task/` (Core Specification & Task Layer)

*   **Structure**:
    *   Defined the **Task Ecosystem** structure: `list/`, `record/`, `declare.jsonl`.
    *   Implemented **JSONL Stream** for deterministic, machine-readable task state.
*   **Standards**:
    *   Formalized the **"AI Task"** unit: separating Intent (Prompt) from Execution (Task).
    *   Standardized **`record.md`** format for capturing reasoning, execution plans, and artifacts.
*   **Governance**:
    *   Established **Task Lifecycle** states (pending -> in_progress -> completed).
    *   Implemented **Task Declaration** (`declare.jsonl`) for categorizing agent capabilities.

### 🧩 `pog-task-manager/` (VS Code Plugin)

*   **Visualization**:
    *   Released initial **VS Code Extension** for human-friendly task management.
    *   Implemented **Task List View** to render JSONL streams as an interactive list.
*   **Interaction**:
    *   Added **"Create Task"** and **"Join Task"** commands for agents and humans.
    *   Integrated **`record.md` Preview** for quick audit and review.
*   **Workflow Integration**:
    *   Enabled seamless switching between code editing and task governance within the IDE.

### 🌳 Root Directory (Project Metadata)

*   **Project Governance**:
    *   **LICENSE**: Adopted **Creative Commons Attribution 4.0 International (CC BY 4.0)** for open adoption.
    *   **AUTHORS.md**: Acknowledged primary author Ted Enjtorian and framework origins.
    *   **README.md**: Comprehensive entry point covering "Why POG Task", Quick Start, and Architecture.
*   **Configuration**:
    *   **mkdocs.yml**: Site configuration for statically generated documentation.


---

**Status**: Published ✨
**Last Updated**: February 2026
