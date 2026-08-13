import { visit } from 'unist-util-visit';

/**
 * @param {string} text
 * @returns {number}
 */
function countWords(text) {
	const normalized = text.trim();
	if (!normalized) return 0;
	return normalized.split(/\s+/).length;
}

/**
 * Remark plugin that injects reading-time metadata into `file.data.fm`.
 *
 * @param {{ wordsPerMinute?: number; attribute?: string }} [options]
 * @returns {(tree: import('unist').Node, file: import('vfile').VFile) => void}
 */
export function remarkReadingTime(options = {}) {
	const wordsPerMinute = options.wordsPerMinute ?? 200;
	const attribute = options.attribute ?? 'readingTime';

	return (tree, file) => {
		/** @type {string[]} */
		const chunks = [];

		visit(tree, 'text', (/** @type {{ value?: string }} */ node) => {
			chunks.push(node.value ?? '');
		});

		const words = countWords(chunks.join(' '));
		const minutes = words === 0 ? 1 : Math.max(1, Math.ceil(words / wordsPerMinute));
		const readingTime = {
			text: `${minutes} min read`,
			minutes,
			words
		};

		if (!file.data.fm || typeof file.data.fm !== 'object') {
			file.data.fm = {};
		}
		const fm = /** @type {Record<string, unknown>} */ (file.data.fm);
		fm[attribute] = readingTime;
	};
}
