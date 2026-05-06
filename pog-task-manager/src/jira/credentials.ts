import * as vscode from 'vscode';
import { JIRA_TOKEN_SECRET_KEY, JiraClient } from './client';

export async function setJiraCredentials(context: vscode.ExtensionContext): Promise<void> {
    const cfg = vscode.workspace.getConfiguration('pog.taskManager.jira');
    const currentBase = cfg.get<string>('baseUrl', '');

    const baseUrl = await vscode.window.showInputBox({
        prompt: 'Jira base URL (e.g. https://jira.company.com)',
        value: currentBase,
        ignoreFocusOut: true,
        validateInput: v => (v && /^https?:\/\//.test(v) ? null : 'Must start with http:// or https://'),
    });
    if (!baseUrl) { return; }

    const token = await vscode.window.showInputBox({
        prompt: 'Jira Personal Access Token (stored in SecretStorage, not settings.json)',
        password: true,
        ignoreFocusOut: true,
    });
    if (!token) { return; }

    await cfg.update('baseUrl', baseUrl, vscode.ConfigurationTarget.Global);
    await context.secrets.store(JIRA_TOKEN_SECRET_KEY, token);

    vscode.window.showInformationMessage('Pog Jira: credentials saved.');
}

export async function getJiraClient(context: vscode.ExtensionContext): Promise<JiraClient> {
    const cfg = vscode.workspace.getConfiguration('pog.taskManager.jira');
    const baseUrl = cfg.get<string>('baseUrl', '');
    const token = await context.secrets.get(JIRA_TOKEN_SECRET_KEY);
    if (!baseUrl || !token) {
        throw new Error('Jira not configured. Run "POG Task Manager: Jira — Set Connection" first.');
    }
    return new JiraClient(baseUrl, token);
}
