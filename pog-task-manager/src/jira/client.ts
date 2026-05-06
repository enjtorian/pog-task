import * as https from 'https';
import * as http from 'http';
import { URL } from 'url';

export interface JiraIssue {
    key: string;
    summary: string;
    description: string;
    status: string;
}

export interface JiraTransition {
    id: string;
    name: string;
}

export class JiraClient {
    constructor(private baseUrl: string, private token: string) {
        if (!baseUrl) { throw new Error('Jira base URL not configured'); }
        if (!token) { throw new Error('Jira token not configured'); }
        this.baseUrl = baseUrl.replace(/\/+$/, '');
    }

    async searchIssues(jql: string, maxResults = 100): Promise<JiraIssue[]> {
        const path = `/rest/api/2/search?jql=${encodeURIComponent(jql)}&fields=summary,description,status&maxResults=${maxResults}`;
        const res = await this.request<{ issues: any[] }>('GET', path);
        return (res.issues || []).map(i => ({
            key: i.key,
            summary: i.fields?.summary ?? '',
            description: i.fields?.description ?? '',
            status: i.fields?.status?.name ?? '',
        }));
    }

    async getTransitions(issueKey: string): Promise<JiraTransition[]> {
        const res = await this.request<{ transitions: JiraTransition[] }>(
            'GET',
            `/rest/api/2/issue/${encodeURIComponent(issueKey)}/transitions`
        );
        return res.transitions || [];
    }

    async transitionIssue(issueKey: string, transitionName: string): Promise<void> {
        const transitions = await this.getTransitions(issueKey);
        const match = transitions.find(t => t.name.toLowerCase() === transitionName.toLowerCase());
        if (!match) {
            const available = transitions.map(t => t.name).join(', ') || '(none)';
            throw new Error(`Transition "${transitionName}" not available for ${issueKey}. Available: ${available}`);
        }
        await this.request('POST', `/rest/api/2/issue/${encodeURIComponent(issueKey)}/transitions`, {
            transition: { id: match.id },
        });
    }

    async addComment(issueKey: string, body: string): Promise<void> {
        await this.request('POST', `/rest/api/2/issue/${encodeURIComponent(issueKey)}/comment`, { body });
    }

    private request<T = any>(method: string, path: string, body?: any): Promise<T> {
        const url = new URL(this.baseUrl + path);
        const isHttps = url.protocol === 'https:';
        const lib = isHttps ? https : http;

        const payload = body ? JSON.stringify(body) : undefined;
        const headers: Record<string, string> = {
            Authorization: `Bearer ${this.token}`,
            Accept: 'application/json',
        };
        if (payload) {
            headers['Content-Type'] = 'application/json';
            headers['Content-Length'] = Buffer.byteLength(payload).toString();
        }

        const opts: https.RequestOptions = {
            method,
            hostname: url.hostname,
            port: url.port || (isHttps ? 443 : 80),
            path: url.pathname + url.search,
            headers,
        };

        return new Promise((resolve, reject) => {
            const req = lib.request(opts, res => {
                const chunks: Buffer[] = [];
                res.on('data', c => chunks.push(c));
                res.on('end', () => {
                    const raw = Buffer.concat(chunks).toString('utf8');
                    const status = res.statusCode ?? 0;
                    if (status >= 200 && status < 300) {
                        resolve(raw ? JSON.parse(raw) : ({} as T));
                    } else {
                        reject(new Error(`Jira API ${method} ${path} -> ${status}: ${raw.slice(0, 300)}`));
                    }
                });
            });
            req.on('error', reject);
            if (payload) { req.write(payload); }
            req.end();
        });
    }
}

export const JIRA_TOKEN_SECRET_KEY = 'pog-task-manager.jira.token';
