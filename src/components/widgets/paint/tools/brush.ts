import IconBrush from '@icons/IconBrush.svelte';
import type { Component } from 'svelte';
import type { ToolId, ToolBehavior } from './types';
import { drawStroke } from './strokeUtils';

export const id: ToolId = 'brush';
export const label = 'Brush';
export const icon: Component = IconBrush;

export const behavior: ToolBehavior = {
	startsPath: true,
	persistOnPointerUp: true,
	onPointerMove: ({ ctx, pos, primaryColor, brushSize }) => {
		drawStroke(ctx, pos, primaryColor, brushSize * 3, 'round', 'round');
	}
};
