import { execSync } from 'child_process';
import { dirname } from 'path';

type GitEntry = {
	date: string;
	message: string;
};

function getGitHistory(filePath: string): GitEntry[] {
	try {
		const cwd = dirname(filePath);
		const output = execSync(`git log --follow --format="%ad|%s" --date=short -- "${filePath}"`, {
			encoding: 'utf-8',
			stdio: ['pipe', 'pipe', 'pipe'],
			cwd
		}).trim();

		if (!output) return [];

		return output
			.split('\n')
			.map((line) => line.trim())
			.filter(Boolean)
			.map((line) => {
				const idx = line.indexOf('|');
				return {
					date: line.slice(0, idx),
					message: line.slice(idx + 1)
				};
			});
	} catch {
		return [];
	}
}

export function remarkGitInfo() {
	return (_tree: unknown, file: { history: string[]; data: Record<string, unknown> }) => {
		const filePath = file.history[0];
		if (!filePath) return;

		const history = getGitHistory(filePath);

		// Most recent commit first; oldest commit is the initial publish
		const lastModified = history.length > 0 ? history[0].date : null;
		const publishedAt = history.length > 0 ? history[history.length - 1].date : null;
		const changelog = history.map((e) => e.message);

		if (!file.data.fm || typeof file.data.fm !== 'object') {
			file.data.fm = {};
		}

		const fm = file.data.fm as Record<string, unknown>;
		fm.publishedAt = publishedAt;
		fm.lastModified = lastModified;
		fm.changelog = changelog;
	};
}
