import adapter from '@sveltejs/adapter-cloudflare';
import { mdsvex } from 'mdsvex';
import { remarkReadingTime } from './src/content/blog/remark-reading-time.ts';
import { remarkGitInfo } from './src/content/blog/remark-git-info.ts';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.mdx', '.md'],
	preprocess: [
		mdsvex({
			extensions: ['.mdx', '.md'],
			remarkPlugins: [remarkReadingTime, remarkGitInfo]
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
