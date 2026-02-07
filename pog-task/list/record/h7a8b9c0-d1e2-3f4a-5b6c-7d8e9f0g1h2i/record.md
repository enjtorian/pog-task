# Task Record: POG Task Manager Plugin 優化：自動列出 Record 目錄檔案

## Prompt
> Related Files 除了 條列 之外 直接把 pog-task/list/record/uuid 所屬的 都列出來

## Execution Details
- Modified `src/ui/taskWebviewPanel.ts`:
    - In `_update()` method:
        - Constructed the path `pog-task/list/record/{task.id}`.
        - Used `vscode.workspace.findFiles` with a `RelativePattern` to scan all files recursively in that directory.
        - Merged these auto-discovered files with the explicit `task.related_files` list.
    - Updated `_getHtmlForWebview()`:
        - Accepts the combined list of files.
        - Renders all files as clickable links in the "Related Files" section.

## Verification
- `npm run compile` passed.
- Manual verification:
    - Open a task that has a corresponding `record/{uuid}` directory with files.
    - The "Related Files" section in the Task Detail view should now list all those files automatically, without them being explicitly listed in the JSONL `related_files` array.

## Artifacts
- `src/ui/taskWebviewPanel.ts` (updated)
