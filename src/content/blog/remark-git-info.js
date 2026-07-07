import { execSync } from 'node:child_process';
import { dirname, relative } from 'node:path';

/**
 * @typedef {{ date: string; message: string }} GitEntry
 */

/**
 * Returns the git commit history for a file, most recent first.
 *
 * @param {string} filePath
 * @returns {GitEntry[]}
 */
function getGitHistory(filePath) {
	try {
		const dir = dirname(filePath);
		const root = execSync('git rev-parse --show-toplevel', {
			encoding: 'utf-8',
			stdio: ['pipe', 'pipe', 'pipe'],
			cwd: dir
		}).trim();
		const relPath = relative(root, filePath);
		const output = execSync(`git log --follow --format="%ad|%s" --date=short -- "${relPath}"`, {
			encoding: 'utf-8',
			stdio: ['pipe', 'pipe', 'pipe'],
			cwd: root
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
	} catch (e) {
		console.log('failed git stuff', e);
		return [];
	}
}

/**
 * Remark plugin that injects `publishedAt`, `lastModified`, and `changelog`
 * into `file.data.fm` using the file's git history.
 *
 * @returns {(_tree: unknown, file: import('vfile').VFile) => void}
 */
export function remarkGitInfo() {
	return (_tree, file) => {
		const filePath = file.history[0];
		if (!filePath) return;

		const history = getGitHistory(filePath);

		const lastModified = history.length > 0 ? history[0].date : null;
		const publishedAt = history.length > 0 ? history[history.length - 1].date : null;
		const changelog = history.map((e) => e.message);
		console.log({ lastModified, publishedAt, changelog, history, filePath });

		if (!file.data.fm || typeof file.data.fm !== 'object') {
			file.data.fm = {};
		}

		const fm = file.data.fm;
		fm.publishedAt = publishedAt;
		fm.lastModified = lastModified;
		fm.changelog = changelog;
	};
}
