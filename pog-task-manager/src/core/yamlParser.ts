import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { TaskRecord } from './types';

export class YamlParser {
    static parseFile(filePath: string): TaskRecord | null {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const data = yaml.load(content) as TaskRecord;
            return data;
        } catch (e) {
            console.error(`Failed to parse YAML file ${filePath}:`, e);
            return null;
        }
    }
}
