import { fileURLToPath } from 'node:url';

import adapter from '@sveltejs/adapter-cloudflare';
import { sveltekit } from '@sveltejs/kit/vite';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

import { compilerOptions, extensions, preprocess } from './svelte.shared.js';
import { folderThumbnails } from './vite-plugins/folder-thumbnails.ts';

export default defineConfig({
	resolve: {
		alias: {
			'@components': fileURLToPath(new URL('./src/components', import.meta.url)),
			'@icons': fileURLToPath(new URL('./src/icons', import.meta.url)),
			'@widgets': fileURLToPath(new URL('./src/components/widgets', import.meta.url)),
			'@utils': fileURLToPath(new URL('./src/util', import.meta.url))
		}
	},
	plugins: [
		sveltekit({
			extensions,
			preprocess,
			compilerOptions,
			// Inline critical CSS for better CLS etc
			inlineStyleThreshold: 24576,
			prerender: {
				// `at://` links (AT Protocol identifiers for standard.site
				// verification, see src/content/standard-site.ts) use a scheme the
				// crawler can't parse as a URL and are expected — ignore only
				// those, but keep failing the build on any other invalid URL.
				// https://github.com/sveltejs/kit/issues/15935
				handleInvalidUrl: ({ href, message }) => {
					if (href.startsWith('at://')) return;
					throw new Error(message);
				}
			},
			adapter: adapter({
				// The D1 binding is `remote = true`, so `getPlatformProxy` (used by dev,
				// prerendering and `vite preview`) tries to open a remote proxy session,
				// which needs a CLOUDFLARE_API_TOKEN. That token is absent in tests/CI, so
				// fall back to local D1 emulation there. When a token *is* present (local
				// dev), keep the default behaviour and connect to the real remote binding.
				platformProxy: {
					remoteBindings: process.env.CLOUDFLARE_API_TOKEN ? undefined : false
				}
			})
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
