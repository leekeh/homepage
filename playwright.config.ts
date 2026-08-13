import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;
const baseURL = `http://localhost:${PORT}`;

/**
 * Global OS end-to-end tests.
 *
 * These exercise the whole shell (not isolated widgets) across the three
 * environments that matter for this progressively-enhanced site:
 *   - desktop  (> 768px): windows, taskbar, icons
 *   - mobile   (≤ 768px): full-screen tabs, app menu
 *   - no-js               : static prerendered HTML, plain anchor links
 *
 * The server serves the *built* app so the no-js suite sees the same
 * prerendered HTML that ships to production.
 */
export default defineConfig({
	testDir: 'e2e',
	// Fail the build on CI if test.only was accidentally committed.
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
	use: {
		baseURL,
		trace: 'on-first-retry'
	},
	projects: [
		{
			name: 'desktop',
			testMatch: /\.desktop\.spec\.ts$/,
			use: { ...devices['Desktop Chrome'] }
		},
		{
			name: 'mobile',
			testMatch: /\.mobile\.spec\.ts$/,
			use: { ...devices['Pixel 5'] }
		},
		{
			name: 'no-js',
			testMatch: /\.nojs\.spec\.ts$/,
			use: { ...devices['Desktop Chrome'], javaScriptEnabled: false }
		},
		{
			// og:image sweep — request-only, so device config is nominal. Run in
			// its own job (affected-scoped); excluded from the OS `e2e` job.
			name: 'og',
			testMatch: /og\.spec\.ts$/,
			use: { ...devices['Desktop Chrome'] }
		}
	],
	webServer: {
		command: 'pnpm run build && pnpm run preview --port ' + PORT,
		port: PORT,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000
	}
});
