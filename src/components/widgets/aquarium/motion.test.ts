import { describe, expect, it } from 'vitest';
import { wrap, depthToY, oscillate, seeded } from './motion';

describe('wrap', () => {
	it('leaves values within range unchanged', () => {
		expect(wrap(5, 0, 10)).toBe(5);
	});

	it('wraps values past the max back to the start', () => {
		expect(wrap(12, 0, 10)).toBe(2);
		expect(wrap(10, 0, 10)).toBe(0);
	});

	it('wraps negative values into range', () => {
		expect(wrap(-3, 0, 10)).toBe(7);
	});

	it('supports non-zero minimums', () => {
		expect(wrap(-30, -20, 100)).toBe(90);
	});

	it('returns min for a zero-width span', () => {
		expect(wrap(5, 4, 4)).toBe(4);
	});
});

describe('depthToY', () => {
	it('maps 0 to the top and 1 to the bottom', () => {
		expect(depthToY(0, 200)).toBe(0);
		expect(depthToY(1, 200)).toBe(200);
		expect(depthToY(0.5, 200)).toBe(100);
	});

	it('respects the margin', () => {
		expect(depthToY(0, 200, 20)).toBe(20);
		expect(depthToY(1, 200, 20)).toBe(180);
	});

	it('clamps out-of-range depths', () => {
		expect(depthToY(-1, 200)).toBe(0);
		expect(depthToY(2, 200)).toBe(200);
	});
});

describe('oscillate', () => {
	it('is zero at the phase origin', () => {
		expect(oscillate(0, 10, 4)).toBeCloseTo(0);
	});

	it('peaks at a quarter period', () => {
		expect(oscillate(1, 10, 4)).toBeCloseTo(10);
	});

	it('returns 0 for a non-positive period', () => {
		expect(oscillate(1, 10, 0)).toBe(0);
	});
});

describe('seeded', () => {
	it('is deterministic for a given seed', () => {
		expect(seeded(3)).toBe(seeded(3));
	});

	it('stays within [0, 1)', () => {
		for (let i = 0; i < 50; i++) {
			const v = seeded(i);
			expect(v).toBeGreaterThanOrEqual(0);
			expect(v).toBeLessThan(1);
		}
	});
});
