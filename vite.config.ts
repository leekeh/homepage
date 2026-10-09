import adapter from '@sveltejs/adapter-cloudflare';
import { sveltekit } from '@sveltejs/kit/vite';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

import { compilerOptions, extensions, preprocess } from './svelte.shared.js';
import { folderThumbnails } from './vite-plugins/folder-thumbnails.ts';

export default defineConfig({
	plugins: [
		sveltekit({
			extensions,
			preprocess,
			compilerOptions,
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
				'@utils/*': 'src/util/*'
			}
		}),
		folderThumbnails()
	],
	test: {
		// An unrelated diff may match no tests in a given project — that's fine.
		passWithNoTests: true,
		// Two projects so we can run fast pure-logic tests in Node and
		// component tests in a real (Playwright-driven) browser.
		projects: [
			{
				// Isolated widget/component tests — rendered in a real browser.
				extends: true,
				test: {
					name: 'client',
					// Files named *.svelte.test.ts run against real DOM in Chromium.
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					setupFiles: ['./vitest-setup-client.ts'],
					browser: {
						enabled: true,
						provider: playwright(),
						headless: true,
						instances: [{ browser: 'chromium' }]
					}
				}
			},
			{
				// Pure-logic unit tests (route matching, data helpers, geometry, …).
				extends: true,
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					// The browser project owns *.svelte.test.ts.
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
