import * as assert from 'assert';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { JsonlParser } from '../../../core/parser';

suite('Core: JsonlParser Test Suite', () => {
    let tmpDir: string;
    let tmpFile: string;

    setup(() => {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pog-task-manager-test-'));
        tmpFile = path.join(tmpDir, 'test.jsonl');
    });

    teardown(() => {
        if (fs.existsSync(tmpFile)) {
            fs.unlinkSync(tmpFile);
        }
        if (fs.existsSync(tmpDir)) {
            fs.rmdirSync(tmpDir);
        }
    });

    test('Parse valid task', async () => {
        const content = `{"type": "task", "id": "1", "title": "Task 1", "status": "pending"}\n{"type": "task", "id": "2", "title": "Task 2", "status": "completed"}`;
        fs.writeFileSync(tmpFile, content, 'utf8');

        const records = await JsonlParser.parseFile(tmpFile);
        assert.strictEqual(records.length, 2);
        assert.strictEqual(records[0].type, 'task');
        // @ts-ignore
        assert.strictEqual(records[0].id, '1');
        // @ts-ignore
        assert.strictEqual(records[1].id, '2');
    });
});
