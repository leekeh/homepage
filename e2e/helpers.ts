import { expect, type Page } from '@playwright/test';

/**
 * The shell shows a ~1.5s "Starting up computer" overlay on first paint that
 * intercepts pointer events until it unmounts. Wait for it to go away before
 * interacting in JS mode. (In no-JS mode the overlay never appears.)
 */
export async function waitForStartup(page: Page) {
	await expect(page.getByText('Starting up computer')).toBeHidden({ timeout: 20_000 });
}
