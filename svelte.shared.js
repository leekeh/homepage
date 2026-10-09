// Shared between vite.config.ts (SvelteKit's `sveltekit()` plugin options)
// and eslint.config.js (`svelte-eslint-parser`'s `svelteConfig` option).
// SvelteKit 3 reads config from the `sveltekit()` plugin in vite.config.ts
// and errors if a `svelte.config.js`/`.ts` file exists, so this file must
// keep a different name.
import { mdsvex, escapeSvelte } from 'mdsvex';
import { createHighlighter } from 'shiki';

import { remarkReadingTime } from './src/content/blog/remark-reading-time.js';
import { remarkGitInfo } from './src/content/blog/remark-git-info.js';

const theme = 'github-light';
const highlighter = await createHighlighter({
	themes: [theme],
	langs: ['javascript', 'typescript', 'tsx', 'vue', 'svelte']
});

export const extensions = ['.svelte', '.mdx', '.md'];

export const preprocess = [
	mdsvex({
		extensions: ['.mdx', '.md'],
		remarkPlugins: [remarkReadingTime, remarkGitInfo],
		highlight: {
			highlighter: async (code, lang) => {
				const html = escapeSvelte(highlighter.codeToHtml(code, { lang: lang ?? 'text', theme }));
				return `{@html \`${html}\` }`;
			}
		}
	})
];

export const compilerOptions = {
	experimental: {
		async: true
	}
};
