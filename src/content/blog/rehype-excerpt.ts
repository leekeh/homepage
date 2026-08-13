import { visit } from 'unist-util-visit';

type ElementNode = {
	type: string;
	tagName?: string;
	value?: string;
	children: ElementNode[];
};

type RootNode = {
	type: string;
	children: ElementNode[];
};

export type RehypeExcerptOptions = {
	maxLength?: number;
};

function collectText(node: ElementNode): string {
	const chunks: string[] = [];

	for (const child of node.children) {
		if (child.type === 'text') {
			chunks.push(child.value ?? '');
			continue;
		}

		if (child.type === 'element') {
			chunks.push(collectText(child));
		}
	}

	return chunks.join(' ');
}

function clamp(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return `${text.slice(0, maxLength).trimEnd()}...`;
}

export function rehypeExcerpt(options: RehypeExcerptOptions = {}) {
	const maxLength = options.maxLength ?? 200;

	return (tree: RootNode, file: { data: Record<string, unknown> }) => {
		let excerpt = '';

		visit(tree, 'element', (node: ElementNode) => {
			if (excerpt || node.tagName !== 'p') return;
			excerpt = collectText(node).replace(/\s+/g, ' ').trim();
		});

		if (excerpt) {
			file.data.excerpt = clamp(excerpt, maxLength);
		}
	};
}
