# Change Log

All notable changes to the "pog-task-manager" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.3.0] - 2026-05-05

### Added
- **Schema**: Optional `issue` field on Task (string) for external issue keys such as Jira `PROJ-123`. See `pog-task/task.schema.json`.
- **Issue Tasks view**: New tree view in the activity bar that only shows tasks where `issue` is set; labels render as `[KEY] Title`. The existing Task List view is unchanged.
- **Jira Integration (Server / Data Center)**: Three view-title buttons on Issue Tasks:
  - `Pull Todos` — runs a JQL search and writes each issue as a YAML task under `pog-task/list/<pullProject>/<pullModule>/`, with `issue` pre-filled. Existing issues are skipped.
  - `Push Selected` — multi-pick from tasks with `issue` set and `status ∈ {in_review, completed}`; transitions the Jira issue and posts a comment with task notes, last history entry, and `git log --grep=<KEY>` commit links.
  - `Set Connection` — captures Jira base URL (settings) and Personal Access Token (VS Code SecretStorage, key `pog-task-manager.jira.token`).
- **Settings** (`pog.taskManager.jira.*`): `baseUrl`, `defaultJql`, `pullProject` (default `jira`), `pullModule` (default `inbox`), `inReviewTransitionName` (default `In Review`), `doneTransitionName` (default `Done`).

### Notes
- Jira Server / Data Center only (REST v2 + Bearer PAT); no two-way sync.
- Commit URL inference covers GitHub / GitLab / standard SSH remotes; Bitbucket Server needs a custom template.

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