import { expect, test } from '@playwright/test';
import { waitForStartup } from './helpers';

// Mobile shell (viewport ≤ 768px): full-screen tabs, app drawer, header nav.
test.describe('mobile OS', () => {
	test('boots into the mobile shell showing the current app as a tab', async ({ page }) => {
		await page.goto('/');
		await waitForStartup(page);

		// Mobile header is present (the desktop shell is not rendered on mobile).
		await expect(page.getByRole('link', { name: 'Apps' })).toBeVisible();

		// The route-matched window ("/" → About) opens as the active tab.
		await expect(page.getByRole('tab', { name: 'About Me' })).toBeVisible();
		await expect(page.getByRole('tabpanel').getByText("Hi! I'm leekeh")).toBeVisible();
	});

	test('the Apps button opens the drawer, and tapping an app opens it as a tab', async ({
		page
	}) => {
		await page.goto('/');
		await waitForStartup(page);

		// Tap the header Apps button to reveal the app drawer.
		await page.getByRole('link', { name: 'Apps' }).click();
		const drawer = page.getByRole('navigation', { name: 'All applications' });
		await expect(drawer).toBeVisible();

		await drawer.getByRole('link', { name: 'Blog' }).click();
		await expect(page).toHaveURL(/\/blog$/);

		// A tab for the opened app appears and its panel shows the widget content.
		await expect(page.getByRole('tab', { name: 'Blog' })).toBeVisible();
		await expect(
			page.getByRole('tabpanel').getByRole('link', { name: 'Global RSS feed' })
		).toBeVisible();
	});
});
