import { describe, expect, it } from 'vitest';
import { formatPrice, getTreatById, modelSrc, posterSrc, treats } from './data';

describe('getTreatById', () => {
	it('finds a treat by its imgId', () => {
		expect(getTreatById('cinnamon-bun')?.title).toBe('Cinnamon roll with miso and pepper');
	});

	it('returns undefined for an unknown id', () => {
		expect(getTreatById('nope')).toBeUndefined();
	});

	it('every treat references a defined location', async () => {
		const { locations } = await import('./data');
		for (const treat of treats) {
			expect(locations[treat.locationId], `location for ${treat.imgId}`).toBeDefined();
		}
	});
});

describe('formatPrice', () => {
	it('formats a numeric price as euros', () => {
		expect(formatPrice('3.5')).toBe('€3.50');
	});

	it('handles whole numbers', () => {
		expect(formatPrice('7')).toBe('€7.00');
	});

	it('returns a fallback for empty or non-numeric input', () => {
		expect(formatPrice('')).toBe('price unknown');
		expect(formatPrice('   ')).toBe('price unknown');
		expect(formatPrice('??')).toBe('price unknown');
	});
});

describe('asset src helpers', () => {
	it('builds the model and poster paths from the imgId', () => {
		expect(modelSrc('cinnamon-bun')).toBe('/models/treats/cinnamon-bun.glb');
		expect(posterSrc('cinnamon-bun')).toBe('/models/treats/cinnamon-bun.png');
	});
});
