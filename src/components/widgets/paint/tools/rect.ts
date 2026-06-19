import IconSquare from '@icons/IconSquare.svelte';
import type { Component } from 'svelte';
import type { ToolId, ToolBehavior } from './types';
import { constrainEqualSides } from '../geometryUtils';

export const id: ToolId = 'rect';
export const label = 'Rectangle';
export const icon: Component = IconSquare;

export const behavior: ToolBehavior = {
	requiresSnapshot: true,
	persistOnPointerUp: true,
	onPointerMove: ({ ctx, pos, primaryColor, brushSize, startPos, shiftKey, snapshot }) => {
		if (!snapshot) return;
		ctx.putImageData(snapshot, 0, 0);
		const end = shiftKey ? constrainEqualSides(startPos, pos) : pos;
		ctx.strokeStyle = primaryColor;
		ctx.lineWidth = brushSize;
		ctx.strokeRect(startPos.x, startPos.y, end.x - startPos.x, end.y - startPos.y);
	}
};
