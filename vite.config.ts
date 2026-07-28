import { sveltekit } from '@sveltejs/kit/vite';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
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
					// Nothing to run for this project on an unrelated diff is fine.
					passWithNoTests: true,
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
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					passWithNoTests: true
				}
			}
		]
	}
});
