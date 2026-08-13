import { describe, expect, it } from 'vitest';
import {
	clamp,
	constrainEqualSides,
	constrainLine,
	normalizeRect,
	pointInRect
} from './geometryUtils';

describe('clamp', () => {
	it('clamps below, within, and above the range', () => {
		expect(clamp(-5, 0, 10)).toBe(0);
		expect(clamp(5, 0, 10)).toBe(5);
		expect(clamp(15, 0, 10)).toBe(10);
	});
});

describe('normalizeRect', () => {
	it('normalizes regardless of corner order', () => {
		expect(normalizeRect(10, 10, 4, 2)).toEqual({ x: 4, y: 2, width: 6, height: 8 });
	});

	it('produces a zero-size rect for a single point', () => {
		expect(normalizeRect(3, 3, 3, 3)).toEqual({ x: 3, y: 3, width: 0, height: 0 });
	});
});

describe('pointInRect', () => {
	const rect = { x: 0, y: 0, width: 10, height: 10 };

	it('includes interior and boundary points', () => {
		expect(pointInRect(5, 5, rect)).toBe(true);
		expect(pointInRect(0, 0, rect)).toBe(true);
		expect(pointInRect(10, 10, rect)).toBe(true);
	});

	it('excludes points outside the rect', () => {
		expect(pointInRect(-1, 5, rect)).toBe(false);
		expect(pointInRect(11, 5, rect)).toBe(false);
	});
});

describe('constrainLine', () => {
	it('snaps a near-horizontal line to horizontal', () => {
		const result = constrainLine({ x: 0, y: 0 }, { x: 100, y: 5 });
		expect(result.y).toBe(0);
		expect(result.x).toBeGreaterThan(90);
	});

	it('snaps a ~45° line to the diagonal', () => {
		const result = constrainLine({ x: 0, y: 0 }, { x: 100, y: 90 });
		expect(result.x).toBe(result.y);
	});

	it('returns the point unchanged when start and end coincide', () => {
		expect(constrainLine({ x: 4, y: 4 }, { x: 4, y: 4 })).toEqual({ x: 4, y: 4 });
	});
});

describe('constrainEqualSides', () => {
	it('forces equal width and height using the larger delta', () => {
		const result = constrainEqualSides({ x: 0, y: 0 }, { x: 30, y: 10 });
		expect(result).toEqual({ x: 30, y: 30 });
	});

	it('preserves the direction of each axis', () => {
		const result = constrainEqualSides({ x: 0, y: 0 }, { x: -5, y: 40 });
		expect(result).toEqual({ x: -40, y: 40 });
	});
});
