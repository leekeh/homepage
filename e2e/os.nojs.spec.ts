import { expect, test } from '@playwright/test';

// Progressive enhancement: with JavaScript disabled the site must still render
// prerendered content and navigate via plain anchor links.
// (This project runs with `javaScriptEnabled: false` — see playwright.config.ts.)
//
// Without JS both the desktop and mobile shells are present in the static HTML
// (CSS hides one per viewport), so assertions are scoped to the desktop shell's
// #desktop-content to stay unambiguous at this viewport.
test.describe('no-JS', () => {
	test('renders the about page as static HTML', async ({ page }) => {
		await page.goto('/');

		await expect(page.getByRole('heading', { name: 'leekeh' })).toBeAttached();
		await expect(page.locator('#desktop-content').getByText("Hi! I'm leekeh")).toBeVisible();

		// The startup overlay markup ships in the SSR HTML but is JS-driven, so
		// without JS it must stay hidden (the `js-hydrating` class is never added).
		await expect(page.getByText('Starting up computer')).toBeHidden();
	});

	test('renders a content route directly', async ({ page }) => {
		await page.goto('/blog');
		await expect(
			page.locator('#desktop-content').getByRole('link', { name: 'Global RSS feed' })
		).toBeVisible();
	});

	test('navigates between pages via anchor links', async ({ page }) => {
		await page.goto('/');

		// Desktop icons degrade to plain links that navigate the browser.
		await page
			.getByRole('navigation', { name: 'Desktop links' })
			.getByRole('link', { name: 'Blog' })
			.click();

		await expect(page).toHaveURL(/\/blog$/);
		await expect(
			page.locator('#desktop-content').getByRole('link', { name: 'Global RSS feed' })
		).toBeVisible();
	});
});
