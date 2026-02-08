import * as fs from 'fs';
import * as vscode from 'vscode';
import * as yaml from 'js-yaml';
import { YamlParser } from './yamlParser';
import { Task, TaskMetadata } from './types';

export class TaskStore {
    private tasks: Map<string, Task> = new Map();
    private _onDidUpdate = new vscode.EventEmitter<void>();
    readonly onDidUpdate = this._onDidUpdate.event;

    constructor() { }

    async load(globPatterns?: string[]) {
        let patterns = globPatterns;

        if (!patterns) {
            const config = vscode.workspace.getConfiguration('pog.taskManager');
            const directories = config.get<string[]>('taskDirectories') || ['./pog-task/list'];

            // Resolve directories relative to workspace
            patterns = directories.map(dir => {
                // Remove trailing slash if present
                let cleanDir = dir.replace(/\/$/, '');
                // Remove leading ./ or /
                cleanDir = cleanDir.replace(/^\.?\//, '');

                // Convert to glob pattern for YAML
                return `${cleanDir}/**/*.yaml`;
            });
        }

        const allFiles: vscode.Uri[] = [];

        for (const pattern of patterns) {
            const files = await vscode.workspace.findFiles(pattern);
            allFiles.push(...files);
        }

        // Deduplicate files by path
        const uniqueFiles = new Map<string, vscode.Uri>();
        for (const file of allFiles) {
            uniqueFiles.set(file.fsPath, file);
        }

        const sortedFiles = Array.from(uniqueFiles.values());

        // Sort files to ensure deterministic order (Project/Module order)
        sortedFiles.sort((a, b) => a.fsPath.localeCompare(b.fsPath));

        this.tasks.clear();

        for (const file of sortedFiles) {
            await this.loadFile(file.fsPath);
        }

        this._onDidUpdate.fire();
    }

    private async loadFile(filePath: string) {
        const data = YamlParser.parseFile(filePath);
        if (!data || data.type !== 'task') {
            return;
        }

        const task = data as Task;

        // Extract Project/Module from path
        // Expected path: .../list/{project}/{module}/{title}.yaml
        const pathParts = filePath.split(/[\\/]/);
        const fileName = pathParts.pop();
        const module = pathParts.pop();
        const project = pathParts.pop();

        task._filePath = filePath;
        task._project = project || 'Unknown';
        task._module = module || 'Unknown';

        this.tasks.set(task.id, task);
    }

    getTask(id: string): Task | undefined {
        return this.tasks.get(id);
    }

    getAllTasks(): Task[] {
        return Array.from(this.tasks.values());
    }

    getChildTasks(parentId: string): Task[] {
        // Direct parent_task reference
        const children = this.getAllTasks().filter(t => t.parent_task === parentId);

        // Also check if parent has subtasks array (double linking)
        const parent = this.getTask(parentId);
        if (parent && parent.subtasks) {
            for (const subId of parent.subtasks) {
                if (!children.find(c => c.id === subId)) {
                    const subTask = this.getTask(subId);
                    if (subTask) { children.push(subTask); }
                }
            }
        }
        return children;
    }

    getRootTasks(): Task[] {
        return this.getAllTasks().filter(t => !t.parent_task);
    }

    // --- Organization Methods ---

    getProjects(): string[] {
        const projects = new Set<string>();
        // Iterate in insertion order (Map preserves it)
        for (const task of this.tasks.values()) {
            if (task._project) { projects.add(task._project); }
        }
        return Array.from(projects);
    }

    getModules(project: string): string[] {
        const modules = new Set<string>();
        for (const task of this.tasks.values()) {
            if (task._project === project && task._module) {
                modules.add(task._module);
            }
        }
        return Array.from(modules);
    }

    getTasks(project: string, module: string): Task[] {
        const result: Task[] = [];
        for (const task of this.tasks.values()) {
            if (task._project === project && task._module === module) {
                // Show as root if:
                // 1. It has no parent_task
                // 2. OR It has a parent_task, but that parent is NOT in the store (orphan)
                // 3. OR It has a parent_task, but that parent belongs to a different project/module (optional, but good for visibility)

                const isRoot = !task.parent_task || !this.tasks.has(task.parent_task);

                if (isRoot) {
                    result.push(task);
                }
            }
        }
        return result;
    }

    getSubtasks(parentTaskId: string): Task[] {
        const parent = this.getTask(parentTaskId);
        if (!parent) { return []; }

        const explicitSubtasks = (parent.subtasks || [])
            .map(id => this.getTask(id))
            .filter((t): t is Task => !!t);

        const implicitSubtasks = this.getChildTasks(parentTaskId);

        // Combine and deduplicate
        // Use a Map or Set to prevent duplicates.
        // We want to preserve the order of 'explicitSubtasks' first, then append 'implicitSubtasks' (which usually follow file order)

        const seenIds = new Set<string>();
        const result: Task[] = [];

        for (const t of explicitSubtasks) {
            if (!seenIds.has(t.id)) {
                seenIds.add(t.id);
                result.push(t);
            }
        }

        for (const t of implicitSubtasks) {
            if (!seenIds.has(t.id)) {
                seenIds.add(t.id);
                result.push(t);
            }
        }

        return result;
    }


    async saveTask(task: Task, updates: Partial<Task>) {
        if (!task._filePath) {
            throw new Error('Task file path not found');
        }

        const filePath = task._filePath;
        const updatedTask = { ...task, ...updates };

        // Remove runtime properties before saving
        const dataToSave = { ...updatedTask };
        delete dataToSave._filePath;
        delete dataToSave._project;
        delete dataToSave._module;

        const yamlContent = yaml.dump(dataToSave, {
            indent: 2,
            lineWidth: -1,
            noRefs: true
        });

        fs.writeFileSync(filePath, yamlContent, 'utf-8');
        // Watcher will trigger reload
    }

    async createTask(task: Task, filePath: string) {
        const dataToSave = { ...task };
        delete dataToSave._filePath;
        delete dataToSave._project;
        delete dataToSave._module;

        const yamlContent = yaml.dump(dataToSave, {
            indent: 2,
            lineWidth: -1,
            noRefs: true
        });

        fs.writeFileSync(filePath, yamlContent, 'utf-8');
    }

    getLoadedFiles(): string[] {
        const files = new Set<string>();
        for (const task of this.getAllTasks()) {
            if (task._filePath) {
                files.add(task._filePath);
            }
        }
        return Array.from(files);
    }
}
