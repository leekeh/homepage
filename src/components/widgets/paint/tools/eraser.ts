import IconEraser from '@icons/IconEraser.svelte';
import type { Component } from 'svelte';
import type { ToolId, ToolBehavior } from './types';
import { drawStroke } from './strokeUtils';

export const id: ToolId = 'eraser';
export const label = 'Eraser';
export const icon: Component = IconEraser;

export const behavior: ToolBehavior = {
	startsPath: true,
	persistOnPointerUp: true,
	onPointerMove: ({ ctx, pos, brushSize }) => {
		drawStroke(ctx, pos, '#ffffff', brushSize * 4, 'square', 'round');
	}
};
