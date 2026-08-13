import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { STATIC_WIDGET_ROUTES, discoverBlogRoutes, treatRoutes } from './routes';

/**
 * The shell shows a ~1.5s "Starting up computer" overlay on first paint that
 * intercepts pointer events until it unmounts. Wait for it to go away before
 * interacting in JS mode. (In no-JS mode the overlay never appears.)
 */
export async function waitForStartup(page: Page) {
	await expect(page.getByText('Starting up computer')).toBeHidden({ timeout: 20_000 });
}

/** Compact, readable summary of axe violations for a failure message. */
function formatViolations(violations: Awaited<ReturnType<AxeBuilder['analyze']>>['violations']) {
	return violations
		.map((v) => {
			const targets = v.nodes.map((n) => `      ${n.target.join(' ')}`).join('\n');
			return `  [${v.impact}] ${v.id}: ${v.help}\n${targets}`;
		})
		.join('\n');
}

/** Navigate to a route, wait for the shell, and return its axe violations. */
async function analyzeRoute(page: Page, route: string) {
	await page.goto(route);
	await waitForStartup(page);
	const { violations } = await new AxeBuilder({ page }).exclude('iframe').analyze();
	return violations;
}

/**
 * Register the axe-core accessibility sweep for the current Playwright project
 * (desktop or mobile — never no-JS, since axe audits the enhanced, interactive
 * DOM). Call this at the top level of a `*.desktop.spec.ts` / `*.mobile.spec.ts`
 * file; the project's device config supplies the viewport.
 *
 * Static widget + treat routes are known at collection time, so each gets its
 * own isolated test (parallelised, independent timeout). Blog posts are
 * SSR-only and discovered from /rss.xml at runtime, so they share one test that
 * soft-asserts each post (visiting them all and reporting every offender).
 */
export function registerAxeSweep() {
	for (const route of [...STATIC_WIDGET_ROUTES, ...treatRoutes()]) {
		test(`axe: ${route}`, async ({ page }) => {
			const violations = await analyzeRoute(page, route);
			expect(violations, formatViolations(violations)).toEqual([]);
		});
	}

	test('axe: blog posts', async ({ page, request }) => {
		const routes = await discoverBlogRoutes(request);
		test.skip(routes.length === 0, 'no published blog posts to audit');
		// One test walks every post, so give it room beyond the per-test default.
		test.setTimeout(30_000 * Math.max(1, routes.length));

		for (const route of routes) {
			await test.step(route, async () => {
				const violations = await analyzeRoute(page, route);
				expect
					.soft(
						violations,
						`Accessibility violations on ${route}:\n${formatViolations(violations)}`
					)
					.toEqual([]);
			});
		}
	});
}
