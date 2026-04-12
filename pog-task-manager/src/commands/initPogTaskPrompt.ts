import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

interface PromptFile {
    url: string;
    filename: string;
    relDir?: string;
}

export async function initPogTaskPrompt() {
    // Step 1: Ask for code
    const code = await vscode.window.showInputBox({
        prompt: 'Enter activation code to download prompt templates',
        placeHolder: 'Enter code...',
        password: true,
        validateInput: (value) => {
            if (!value || value.trim().length === 0) {
                return 'Code is required';
            }
            return null;
        }
    });

    if (!code) { return; }

    // Step 2: Fetch prompt list
    const config = vscode.workspace.getConfiguration('pog.taskManager');
    const apiUrl = config.get<string>('promptListApiUrl', 'https://pog-task.ai/vscode-plugin/index.json');

    let promptFiles: PromptFile[] = [];
    try {
        promptFiles = await fetchPromptList(apiUrl, code);
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to fetch prompt list: ${error}`);
        return;
    }

    if (promptFiles.length === 0) {
        vscode.window.showErrorMessage('No prompt templates found or invalid activation code.');
        return;
    }

    // Step 3: Determine target directory
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace folder open.');
        return;
    }

    const rootPath = workspaceFolders[0].uri.fsPath;
    const promptDir = config.get<string>('promptTemplateDirectory', './pog-task/prompts');
    const baseTargetDir = path.join(rootPath, promptDir);

    // Step 4: Download files
    let successCount = 0;
    let errorCount = 0;

    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Downloading prompt templates...',
        cancellable: false
    }, async (progress) => {
        for (const file of promptFiles) {
            progress.report({ message: `Downloading ${file.filename}...` });

            const fileTargetDir = file.relDir ? path.join(baseTargetDir, file.relDir) : baseTargetDir;
            if (!fs.existsSync(fileTargetDir)) {
                fs.mkdirSync(fileTargetDir, { recursive: true });
            }

            const dest = path.join(fileTargetDir, file.filename);

            if (fs.existsSync(dest)) {
                successCount++;
                continue;
            }

            try {
                await downloadFile(file.url, dest);
                successCount++;
            } catch (error) {
                errorCount++;
                vscode.window.showErrorMessage(`Failed to download ${file.filename}: ${error}`);
            }
        }
    });

    if (errorCount === 0) {
        vscode.window.showInformationMessage(`Successfully downloaded ${successCount} prompt template(s) to ${promptDir}`);
    } else {
        vscode.window.showWarningMessage(`Downloaded ${successCount} file(s), ${errorCount} failed.`);
    }
}

async function fetchPromptList(apiUrl: string, code: string): Promise<PromptFile[]> {
    const url = `${apiUrl}?VALID_CODE=${code}`;
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`HTTP status ${res.statusCode}`));
                return;
            }

            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (Array.isArray(json)) {
                        resolve(json as PromptFile[]);
                    } else {
                        reject(new Error('Invalid response format: expected an array.'));
                    }
                } catch (err) {
                    reject(new Error(`Failed to parse prompt list: ${err}`));
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

function downloadFile(url: string, dest: string): Promise<void> {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`HTTP ${response.statusCode}`));
                return;
            }

            const data: Buffer[] = [];
            response.on('data', (chunk) => data.push(chunk));
            response.on('end', () => {
                try {
                    fs.writeFileSync(dest, Buffer.concat(data));
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }).on('error', reject);
    });
}
