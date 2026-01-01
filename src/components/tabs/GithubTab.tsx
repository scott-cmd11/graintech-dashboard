import { GitHubReposExplorer } from '../GitHubReposExplorer';

export function GithubTab() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <GitHubReposExplorer />
        </div>
    );
}
