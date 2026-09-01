import adapter from '@sveltejs/adapter-cloudflare';
import { mdsvex, escapeSvelte } from 'mdsvex';
import { createHighlighter } from 'shiki';

import { remarkReadingTime } from './src/content/blog/remark-reading-time.js';
import { remarkGitInfo } from './src/content/blog/remark-git-info.js';

const theme = 'github-light';
const highlighter = await createHighlighter({
	themes: [theme],
	langs: ['javascript', 'typescript', 'tsx', 'vue', 'svelte']
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
		// Inline critical CSS for better CLS etc
		inlineStyleThreshold: 24576,
		prerender: { handleInvalidUrl: 'warn' },
		adapter: adapter({
			// The D1 binding is `remote = true`, so `getPlatformProxy` (used by dev,
			// prerendering and `vite preview`) tries to open a remote proxy session,
			// which needs a CLOUDFLARE_API_TOKEN. That token is absent in tests/CI, so
			// fall back to local D1 emulation there. When a token *is* present (local
			// dev), keep the default behaviour and connect to the real remote binding.
			platformProxy: {
				remoteBindings: process.env.CLOUDFLARE_API_TOKEN ? undefined : false
			}
		}),
		alias: {
			'@components/*': 'src/components/*',
			'@icons/*': 'src/icons/*',
			'@widgets/*': 'src/components/widgets/*',
			'@assets/*': 'src/assets/*',
			'@utils/*': 'src/util/*'
		}
	}
};

export default config;
