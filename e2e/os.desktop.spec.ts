import { expect, test } from '@playwright/test';
import { waitForStartup } from './helpers';

// Desktop shell (viewport > 768px): desktop icons, windows, taskbar.
test.describe('desktop OS', () => {
	test('boots into the desktop shell with app icons', async ({ page }) => {
		await page.goto('/');
		await waitForStartup(page);

		await expect(page.getByRole('heading', { name: 'leekeh' })).toBeAttached();

		const icons = page.getByRole('navigation', { name: 'Desktop links' });
		await expect(icons).toBeVisible();
		await expect(icons.getByRole('link', { name: 'Blog' })).toBeVisible();
	});

	test('opening an app icon opens a window and adds a taskbar entry', async ({ page }) => {
		await page.goto('/');
		await waitForStartup(page);

		await page
			.getByRole('navigation', { name: 'Desktop links' })
			.getByRole('link', { name: 'Blog' })
			.click();

		await expect(page).toHaveURL(/\/blog$/);

		// The blog window opened: its content (the "All posts" RSS link) is visible...
		await expect(page.getByRole('link', { name: 'Global RSS feed' })).toBeVisible();
		// ...and the taskbar has a window button for it.
		await expect(
			page.getByRole('menubar', { name: 'Open windows' }).getByRole('menuitem', { name: 'Blog' })
		).toBeVisible();
	});
});
