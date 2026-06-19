import type { DrawPos } from './tools/types';

export type Rect = { x: number; y: number; width: number; height: number };

export function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

export function normalizeRect(x1: number, y1: number, x2: number, y2: number): Rect {
	return {
		x: Math.min(x1, x2),
		y: Math.min(y1, y2),
		width: Math.abs(x2 - x1),
		height: Math.abs(y2 - y1)
	};
}

export function pointInRect(x: number, y: number, rect: Rect): boolean {
	return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
}

export function constrainLine(startPos: DrawPos, pos: DrawPos): DrawPos {
	const dx = pos.x - startPos.x;
	const dy = pos.y - startPos.y;
	const distance = Math.hypot(dx, dy);
	if (distance === 0) return pos;
	const angle = Math.atan2(dy, dx);
	const snapped = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
	return {
		x: Math.round(startPos.x + Math.cos(snapped) * distance),
		y: Math.round(startPos.y + Math.sin(snapped) * distance)
	};
}

export function constrainEqualSides(startPos: DrawPos, pos: DrawPos): DrawPos {
	const dx = pos.x - startPos.x;
	const dy = pos.y - startPos.y;
	const side = Math.max(Math.abs(dx), Math.abs(dy));
	return {
		x: startPos.x + (dx >= 0 ? side : -side),
		y: startPos.y + (dy >= 0 ? side : -side)
	};
}
