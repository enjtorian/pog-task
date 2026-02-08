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
    const instructionsUrl = 'https://raw.githubusercontent.com/enjtorian/pog-task/main/pog-task/pog-task-agent-instructions.md';
    const declareUrl = 'https://raw.githubusercontent.com/enjtorian/pog-task/main/pog-task/task.schema.json';

    const instructionsPath = path.join(pogTaskDir, 'pog-task-agent-instructions.md');
    const schemaPath = path.join(pogTaskDir, 'task.schema.json');

    try {
        await downloadFile(instructionsUrl, instructionsPath);
        await downloadFile(declareUrl, schemaPath);
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to download configuration files: ${error}`);
        // Continue even if download fails, to creates the task file
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
            ]
        };

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

function downloadFile(url: string, dest: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}, status code: ${response.statusCode}`));
                return;
            }

            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { }); // Delete the file async. (But we don't check the result)
            reject(err);
        });
    });
}
