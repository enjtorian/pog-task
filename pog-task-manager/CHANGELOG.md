# Change Log

All notable changes to the "pog-task-manager" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.2.2] - 2026-04-15

- **Prompts**: Updated Agent Prompt template to include instructions for recording implementation plans in `record.md`.
- **Naming**: Standardized "Copy Create Prompt" naming to "Copy Task Create" across UI and generated prompts.
- **Config**: Updated default `promptListApiUrl` to `https://task.pog-ai.net/vscode-plugin/index.json`.
- **Documentation**: Updated `README.md` to reflect new prompt structures and record-keeping requirements.

## [1.2.1] - 2026-04-13

- **UI/UX**: Added "Copy Context" button to Task Detail webview.
- **Project Creation**: Enhanced inline project creation with module selection.
- **Templates**: Implemented dynamic remote fetching for prompt templates and editor-direct opening.

## [1.2.0] - 2026-04-12

- **Task Detail**: Display `original_prompt` in webview.
- **UI Enhancements**: Added inline `+` button in Task List for `Copy Task Create`.
- **Dashboard**: New webview for project/module summary and statistics.
- **Prompt Templates**: Added `Init Prompt Templates` and a dedicated TreeView for managing templates.
- **Initialization**: `initPogTask` now provides richer set of default files.
- **Robustness**: Added startup detection and workspace masking.

## [1.1.1] - 2026-02-10

### Fixed: Data Loss in `quickAdd`
### Fixed: Config Overwrite & Unverified Download in `initPogTask`

## [1.1.0]

- **YAML Transition**: Updated extension to support the new YAML-based project/module nested directory structure.
- **Task View**: Improved task list rendering for YAML files.

## [1.0.1]

- Add `Init POG Task` command to automatically setup project structure and download configuration files.
- Update documentation with Marketplace link and usage instructions.

## [1.0.0]

- Initial release