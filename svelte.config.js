import adapter from '@sveltejs/adapter-cloudflare';
import { mdsvex, escapeSvelte } from 'mdsvex';
import { createHighlighter } from 'shiki';

import { remarkReadingTime } from './src/content/blog/remark-reading-time.js';
import { remarkGitInfo } from './src/content/blog/remark-git-info.js';

const theme = 'github-light';
const highlighter = await createHighlighter({
	themes: [theme],
	langs: ['javascript', 'typescript', 'tsx', 'vue']
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.mdx', '.md'],
	preprocess: [
		mdsvex({
			extensions: ['.mdx', '.md'],
			remarkPlugins: [remarkReadingTime, remarkGitInfo],
			highlight: {
				highlighter: async (code, lang = 'text') => {
					const html = escapeSvelte(highlighter.codeToHtml(code, { lang, theme }));
					return `{@html \`${html}\` }`;
				}
			}
		})
	],
	compilerOptions: {
		experimental: {
			async: true
		}
	},
	kit: {
		adapter: adapter(),
		alias: {
			'@components/*': 'src/components/*',
			'@icons/*': 'src/icons/*',
			'@widgets/*': 'src/components/widgets/*',
			'@assets/*': 'src/assets/*',
			'@posts/*': 'src/content/blog/posts/*.mdx',
			'@utils/*': 'src/util/*'
		}
	}
};

export default config;
