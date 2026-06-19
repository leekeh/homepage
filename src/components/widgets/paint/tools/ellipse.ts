import IconCircle from '@icons/IconCircle.svelte';
import type { Component } from 'svelte';
import type { ToolId, ToolBehavior } from './types';
import { constrainEqualSides } from '../geometryUtils';

export const id: ToolId = 'ellipse';
export const label = 'Ellipse';
export const icon: Component = IconCircle;

export const behavior: ToolBehavior = {
	requiresSnapshot: true,
	persistOnPointerUp: true,
	onPointerMove: ({ ctx, pos, primaryColor, brushSize, startPos, shiftKey, snapshot }) => {
		if (!snapshot) return;
		ctx.putImageData(snapshot, 0, 0);
		const end = shiftKey ? constrainEqualSides(startPos, pos) : pos;
		const rx = Math.abs(end.x - startPos.x) / 2;
		const ry = Math.abs(end.y - startPos.y) / 2;
		const cx = startPos.x + (end.x - startPos.x) / 2;
		const cy = startPos.y + (end.y - startPos.y) / 2;
		ctx.beginPath();
		ctx.strokeStyle = primaryColor;
		ctx.lineWidth = brushSize;
		ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
		ctx.stroke();
	}
};
