import * as crypto from 'crypto';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

export async function initPogTask() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace folder open. Please open a folder to initialize POG Task.');
        return;
    }

    const rootPath = workspaceFolders[0].uri.fsPath;
    const pogTaskDir = path.join(rootPath, 'pog-task');
    const listDir = path.join(pogTaskDir, 'list');
    const recordDir = path.join(listDir, 'record');

    // Create directories
    try {
        if (!fs.existsSync(pogTaskDir)) {
            fs.mkdirSync(pogTaskDir);
        }
        if (!fs.existsSync(listDir)) {
            fs.mkdirSync(listDir);
        }
        if (!fs.existsSync(recordDir)) {
            fs.mkdirSync(recordDir);
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to create directories: ${error}`);
        return;
    }

    // Download files
    const configFiles = [
        {
            url: 'https://raw.githubusercontent.com/enjtorian/pog-task/main/pog-task/pog-task-agent-instructions.md',
            dest: path.join(pogTaskDir, 'pog-task-agent-instructions.md'),
            sha256: '1c2cbbe4cfa1e24be97501d23e481166df3eba9c937e04ae253bf0ff628f9f08'
        },
        {
            url: 'https://raw.githubusercontent.com/enjtorian/pog-task/main/pog-task/task.schema.json',
            dest: path.join(pogTaskDir, 'task.schema.json'),
            sha256: '74ae3883ee3d8b4e0f65f7ec6fe209d5d8e525c4d0cd22579ad1e7d29b89888b'
        },
        {
            url: 'https://raw.githubusercontent.com/enjtorian/pog-task/main/pog-task/pog-task.py',
            dest: path.join(pogTaskDir, 'pog-task.py'),
            sha256: '69b8cf5a2f28f62eecb8cb011c099fc09341ea2bed7918544ffa0d821926a284'
        }
    ];

    let hasErrors = false;

    for (const config of configFiles) {
        if (fs.existsSync(config.dest)) {
            // calculated hash check could be added here too, but for now we just skip to avoid overwrite
            continue;
        }

        try {
            await downloadFile(config.url, config.dest, config.sha256);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to download ${path.basename(config.dest)}: ${error}`);
            hasErrors = true;
        }
    }

    if (hasErrors) {
        vscode.window.showWarningMessage('Some configuration files failed to download. You may need to manualy fix them.');
    }

    // Create initial task file
    const projectDir = path.join(listDir, 'alpha');
    const moduleDir = path.join(projectDir, 'activate');
    if (!fs.existsSync(projectDir)) { fs.mkdirSync(projectDir); }
    if (!fs.existsSync(moduleDir)) { fs.mkdirSync(moduleDir); }

    const taskFilePath = path.join(moduleDir, '初始化系統任務.yaml');
    if (!fs.existsSync(taskFilePath)) {
        const metadata = {
            type: "task",
            id: "00000000-0000-0000-0000-000000000000", // Example UUID
            title: "初始化系統任務",
            description: "這是系統自動生成的初始化任務",
            category: "feature",
            priority: "medium",
            status: "pending",
            created_at: new Date().toISOString(),
            checklist: [
                { text: "確認系統環境", completed: false }
            ],
            history: [
                {
                    timestamp: new Date().toISOString(),
                    agent: "system",
                    action: "created",
                    message: "系統初始化生成"
                }
            ],
            record_path: "record/00000000-0000-0000-0000-000000000000/record.md"
        };

        // Ensure record directory exists
        const initRecordDir = path.join(moduleDir, 'record', '00000000-0000-0000-0000-000000000000');
        if (!fs.existsSync(initRecordDir)) {
            fs.mkdirSync(initRecordDir, { recursive: true });
            fs.writeFileSync(path.join(initRecordDir, 'record.md'), '# Task Record: 初始化系統任務\n\n');
        }

        try {
            const yaml = require('js-yaml');
            fs.writeFileSync(taskFilePath, yaml.dump(metadata));
            vscode.window.showInformationMessage('POG Task initialized successfully!');
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to create task file: ${error}`);
        }
    } else {
        vscode.window.showInformationMessage('POG Task initialized successfully! (Task file already exists)');
    }
}

function downloadFile(url: string, dest: string, expectedSha256?: string): Promise<void> {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}, status code: ${response.statusCode}`));
                return;
            }

            const data: Buffer[] = [];
            response.on('data', (chunk) => data.push(chunk));
            response.on('end', () => {
                const buffer = Buffer.concat(data);

                if (expectedSha256) {
                    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
                    if (hash !== expectedSha256) {
                        vscode.window.showWarningMessage(`Checksum mismatch for ${path.basename(dest)}. Expected ${expectedSha256}, got ${hash}. File downloaded anyway.`);
                        // Don't return/reject, proceed to write file
                    }
                }

                try {
                    fs.writeFileSync(dest, buffer);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}
