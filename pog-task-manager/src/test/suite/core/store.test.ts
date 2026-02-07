import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { TaskStore } from '../../../core/store';

suite('Core: TaskStore Test Suite', () => {
    let tmpDir: string;
    let tmpFile: string;

    setup(() => {
        // We cannot easily test TaskStore.load with real files because findFiles 
        // works on workspace based on glob patterns, which might not include tmp dir easily.
        // However, we can test logic if we create a file inside the workspace or if we mock loadFile.
        // Since loadFile calls JsonlParser, checking graph logic is easier by subclassing or manual insertion?
        // But TaskStore tasks is private.
        // Let's rely on "loadFile" being private but "tasks" being populated.
        // Actually, we can use a relative path in workspace if we are inside a test workspace.
        // The default test runner opens the extension folder as workspace.
        // So we can write a file to ./pog-task/list/test.jsonl relative to root.
    });

    test('Parent Child Relationship', async () => {
        const store = new TaskStore();

        // Hack: bypass load and insert directly if we could, but properties are private.
        // We will need to write a file to the workspace.
        const wsFolders = vscode.workspace.workspaceFolders;
        if (!wsFolders) {
            // No workspace, skip or fail
            return;
        }

        const rootPath = wsFolders[0].uri.fsPath;
        const taskDir = path.join(rootPath, 'task', 'list');
        fs.mkdirSync(taskDir, { recursive: true });

        const testFile = path.join(taskDir, 'test-store.jsonl');
        const content = [
            JSON.stringify({ type: 'task', id: 'parent-1', title: 'Parent', status: 'pending' }),
            JSON.stringify({ type: 'task', id: 'child-1', title: 'Child 1', parent_task: 'parent-1', status: 'pending' }),
            JSON.stringify({ type: 'task', id: 'parent-2', title: 'Parent 2', subtasks: ['child-2'], status: 'pending' }),
            JSON.stringify({ type: 'task', id: 'child-2', title: 'Child 2', status: 'pending' })
        ].join('\n');

        fs.writeFileSync(testFile, content, 'utf8');

        try {
            // TaskStore default load pattern is 'pog-task/list/**/*.jsonl'
            await store.load();

            const parent1 = store.getTask('parent-1');
            assert.ok(parent1);

            const children1 = store.getChildTasks('parent-1');
            assert.strictEqual(children1.length, 1);
            assert.strictEqual(children1[0].id, 'child-1');

            const parent2 = store.getTask('parent-2');
            assert.ok(parent2);

            const children2 = store.getChildTasks('parent-2');
            assert.strictEqual(children2.length, 1);
            assert.strictEqual(children2[0].id, 'child-2');

        } finally {
            if (fs.existsSync(testFile)) {
                fs.unlinkSync(testFile);
            }
        }
    });
});
