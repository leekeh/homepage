import { expect, test, type Locator } from '@playwright/test';

/**
 * Per-widget progressive enhancement.
 *
 * Every navigable widget must render its OWN content as static, prerendered
 * HTML with JavaScript disabled — not just the global shell. Each route is
 * loaded with JS off (the `no-js` project) and checked for:
 *   1. the correct window opened (its <h2> title bar), and
 *   2. a widget-specific piece of content in the static HTML.
 *
 * Add a row here whenever you add a navigable widget.
 * (This file matches the `no-js` project via its `.nojs.spec.ts` suffix.)
 */
type WidgetCase = {
	route: string;
	/** Window title bar (<h2>) rendered for this route. */
	title: string;
	/** A widget-specific element that must be present in the static HTML. */
	content: (scope: Locator) => Locator;
};

const WIDGETS: WidgetCase[] = [
	{ route: '/', title: 'About Me', content: (s) => s.getByText("Hi! I'm leekeh") },
	{
		route: '/blog',
		title: 'Blog',
		content: (s) => s.getByRole('link', { name: 'Global RSS feed' })
	},
	{
		route: '/paint',
		title: 'Paint',
		content: (s) => s.getByRole('toolbar', { name: 'Color palette' })
	},
	{ route: '/contact', title: 'Contact', content: (s) => s.getByText('Want to get in touch') },
	{ route: '/hire-me', title: 'Bugble | Leekeh', content: (s) => s.getByText('seriously, I') },
	{ route: '/treats', title: 'Sweet Treats', content: (s) => s.getByText('Tasty treats') }
];

test.describe('per-widget no-JS rendering', () => {
	for (const widget of WIDGETS) {
		test(`${widget.title} (${widget.route}) renders without JS`, async ({ page }) => {
			await page.goto(widget.route);

			// Scope to the desktop shell — without JS both shells are in the DOM.
			const scope = page.locator('#desktop-content');

			await expect(scope.getByRole('heading', { level: 2, name: widget.title })).toBeVisible();
			await expect(widget.content(scope).first()).toBeVisible();
		});
	}
});
