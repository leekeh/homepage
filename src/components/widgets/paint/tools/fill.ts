import IconBucket from '@icons/IconBucket.svelte';
import type { Component } from 'svelte';
import type { ToolId, ToolBehavior } from './types';
import { hexToRgba } from '../colorUtils';

export const id: ToolId = 'fill';
export const label = 'Fill';
export const icon: Component = IconBucket;

/**
 * Small tolerance to absorb ±1–2 per-channel rounding errors introduced by
 * the browser's PNG decode → canvas drawImage colour-space pipeline, and
 * to prevent the fill from halting at anti-aliased stroke edges.
 */
const FILL_TOLERANCE = 15;

function floodFill(ctx: CanvasRenderingContext2D, x: number, y: number, fillColor: string) {
	const { width, height } = ctx.canvas;
	const imageData = ctx.getImageData(0, 0, width, height);
	const data = imageData.data;
	const startI = (y * width + x) * 4;
	const tR = data[startI],
		tG = data[startI + 1],
		tB = data[startI + 2],
		tA = data[startI + 3];
	const [fR, fG, fB, fA] = hexToRgba(fillColor);

	// Bail when the target is already (within tolerance of) the fill colour,
	// which also prevents infinite re-visits when fill ≈ target.
	if (
		Math.abs(tR - fR) <= FILL_TOLERANCE &&
		Math.abs(tG - fG) <= FILL_TOLERANCE &&
		Math.abs(tB - fB) <= FILL_TOLERANCE &&
		Math.abs(tA - fA) <= FILL_TOLERANCE
	)
		return;

	const stack: Array<[number, number]> = [[x, y]];
	while (stack.length) {
		const item = stack.pop();
		if (!item) break;
		const [cx, cy] = item;
		if (cx < 0 || cx >= width || cy < 0 || cy >= height) continue;
		const i = (cy * width + cx) * 4;
		if (
			Math.abs(data[i] - tR) > FILL_TOLERANCE ||
			Math.abs(data[i + 1] - tG) > FILL_TOLERANCE ||
			Math.abs(data[i + 2] - tB) > FILL_TOLERANCE ||
			Math.abs(data[i + 3] - tA) > FILL_TOLERANCE
		)
			continue;
		data[i] = fR;
		data[i + 1] = fG;
		data[i + 2] = fB;
		data[i + 3] = fA;
		stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
	}

	ctx.putImageData(imageData, 0, 0);
}

export const behavior: ToolBehavior = {
	instant: true,
	onPointerDown: ({ ctx, pos, primaryColor, persist }) => {
		floodFill(ctx, pos.x, pos.y, primaryColor);
		persist();
	}
};
