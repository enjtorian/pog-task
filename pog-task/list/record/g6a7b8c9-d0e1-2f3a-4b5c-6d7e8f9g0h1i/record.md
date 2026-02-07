# Task Record: POG Task Manager Plugin 優化：Tree View 群組與排序

## Original Prompt
> 調整 task tree 讀取 jsonl 的 project/ module 顯示 然後 排序 依照 jsonl 的順序 然後 task 順序 依照 jsonl 中的順序 sub 也是照順序排

## Execution Details
- Updated `Task` type to include runtime `_project` and `_module` properties.
- Updated `TaskStore`:
    - `load()`: Sorts files by path before processing.
    - `loadFile()`: Parses `project` and `module` from JSONL metadata line.
    - Implemented `getProjects()`, `getModules()`, and `getTasks()`.
    - **Fix**: `getTasks()` now treats orphan tasks (where parent exists in ID but not in store) as root tasks, ensuring visibility.
- Updated `TaskTreeDataProvider`:
    - Implemented hierarchical view: `Project` -> `Module` -> `Task`.
    - Used specific icons for Project and Module items.

## Verification
- Verified `npm run compile` succeeds.
- Manual verification:
    - Task list should now show Projects at top level.
    - Tasks with missing parents (like the optimization task itself) should appear under their respective module.

## Artifacts
- `src/core/store.ts` (updated)
- `src/ui/taskTreeDataProvider.ts` (updated)
- `src/core/types.ts` (updated)
