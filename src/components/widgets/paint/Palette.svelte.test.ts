import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import Palette from './Palette.svelte';
import { paletteColors } from './paletteColors';

/**
 * Isolated widget test: renders a single widget component in a real browser
 * (Chromium, driven by Playwright) with no shell/window-manager around it.
 */
describe('Palette (isolated widget)', () => {
	it('renders one button per palette color inside a toolbar', async () => {
		render(Palette, { primaryColor: paletteColors[0] });

		await expect.element(page.getByRole('toolbar', { name: 'Color palette' })).toBeInTheDocument();
		expect(page.getByRole('button').elements()).toHaveLength(paletteColors.length);
	});

	it('marks the current primary color as pressed', async () => {
		const current = paletteColors[5];
		render(Palette, { primaryColor: current });

		await expect
			.element(page.getByRole('button', { name: `Color ${current}` }))
			.toHaveAttribute('aria-pressed', 'true');
	});

	it('selects a color when its swatch is clicked', async () => {
		render(Palette, { primaryColor: paletteColors[0] });

		const target = paletteColors[8];
		const swatch = page.getByRole('button', { name: `Color ${target}` });
		await swatch.click();

		await expect.element(swatch).toHaveAttribute('aria-pressed', 'true');
		// The previously-selected swatch is no longer pressed.
		await expect
			.element(page.getByRole('button', { name: `Color ${paletteColors[0]}` }))
			.toHaveAttribute('aria-pressed', 'false');
	});
});
