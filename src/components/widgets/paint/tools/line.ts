import IconLine from '@icons/IconLine.svelte';
import type { Component } from 'svelte';
import type { ToolId, ToolBehavior } from './types';
import { constrainLine } from '../geometryUtils';

export const id: ToolId = 'line';
export const label = 'Line';
export const icon: Component = IconLine;

export const behavior: ToolBehavior = {
	requiresSnapshot: true,
	persistOnPointerUp: true,
	onPointerMove: ({ ctx, pos, primaryColor, brushSize, startPos, shiftKey, snapshot }) => {
		if (!snapshot) return;
		ctx.putImageData(snapshot, 0, 0);
		const end = shiftKey ? constrainLine(startPos, pos) : pos;
		ctx.beginPath();
		ctx.strokeStyle = primaryColor;
		ctx.lineWidth = brushSize;
		ctx.lineCap = 'round';
		ctx.moveTo(startPos.x, startPos.y);
		ctx.lineTo(end.x, end.y);
		ctx.stroke();
	}
};
