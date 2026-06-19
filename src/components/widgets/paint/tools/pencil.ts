import IconPencil from '@icons/IconPencil.svelte';
import type { Component } from 'svelte';
import type { ToolId, ToolBehavior } from './types';
import { drawStroke } from './strokeUtils';

export const id: ToolId = 'pencil';
export const label = 'Pencil';
export const icon: Component = IconPencil;

export const behavior: ToolBehavior = {
	startsPath: true,
	persistOnPointerUp: true,
	onPointerMove: ({ ctx, pos, primaryColor, brushSize }) => {
		drawStroke(ctx, pos, primaryColor, brushSize, 'round', 'round');
	}
};
