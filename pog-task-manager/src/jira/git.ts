import { execFile } from 'child_process';

export interface CommitRef {
    sha: string;
    message: string;
    url?: string;
}

export function findCommitsByIssueId(workspaceRoot: string, issueId: string, remoteUrl?: string): Promise<CommitRef[]> {
    return new Promise(resolve => {
        execFile(
            'git',
            ['log', '--all', `--grep=${issueId}`, '--pretty=format:%H%x09%s'],
            { cwd: workspaceRoot, maxBuffer: 10 * 1024 * 1024 },
            (err, stdout) => {
                if (err) { resolve([]); return; }
                const commits: CommitRef[] = stdout
                    .split('\n')
                    .filter(Boolean)
                    .map(line => {
                        const [sha, ...rest] = line.split('\t');
                        const message = rest.join('\t');
                        const ref: CommitRef = { sha, message };
                        if (remoteUrl) {
                            const url = buildCommitUrl(remoteUrl, sha);
                            if (url) { ref.url = url; }
                        }
                        return ref;
                    });
                resolve(commits);
            }
        );
    });
}

export function getRemoteUrl(workspaceRoot: string): Promise<string | undefined> {
    return new Promise(resolve => {
        execFile('git', ['config', '--get', 'remote.origin.url'], { cwd: workspaceRoot }, (err, stdout) => {
            if (err) { resolve(undefined); return; }
            resolve(stdout.trim() || undefined);
        });
    });
}

function buildCommitUrl(remote: string, sha: string): string | undefined {
    let httpsBase: string | undefined;
    const sshMatch = /^git@([^:]+):(.+?)(\.git)?$/.exec(remote);
    if (sshMatch) {
        httpsBase = `https://${sshMatch[1]}/${sshMatch[2]}`;
    } else {
        const httpMatch = /^https?:\/\/(.+?)(\.git)?$/.exec(remote);
        if (httpMatch) { httpsBase = `https://${httpMatch[1]}`; }
    }
    if (!httpsBase) { return undefined; }
    return `${httpsBase}/commit/${sha}`;
}
