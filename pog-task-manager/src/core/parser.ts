import * as fs from 'fs';
import * as readline from 'readline';
import { JsonlRecord, Task } from './types';

export class JsonlParser {
    static async parseFile(filePath: string): Promise<JsonlRecord[]> {
        const fileStream = fs.createReadStream(filePath);

        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        const records: JsonlRecord[] = [];

        for await (const line of rl) {
            if (!line.trim()) { continue; }
            try {
                const record = JSON.parse(line) as JsonlRecord;
                if (record.type === 'task') {
                    (record as Task)._filePath = filePath;
                }
                records.push(record);
            } catch (e) {
                console.error(`Failed to parse line in ${filePath}: ${line}`, e);
            }
        }
        return records;
    }
}
