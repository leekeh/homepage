import IconSpray from '@icons/IconSpray.svelte';
import type { Component } from 'svelte';
import type { ToolId, ToolBehavior } from './types';

export const id: ToolId = 'spray';
export const label = 'Spray paint';
export const icon: Component = IconSpray;

function drawSpray(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	color: string,
	brushSize: number
) {
	const radius = brushSize * 4;
	const density = Math.max(12, brushSize * 12);
	const { width, height } = ctx.canvas;
	ctx.fillStyle = color;
	for (let i = 0; i < density; i += 1) {
		const angle = Math.random() * Math.PI * 2;
		const dist = Math.sqrt(Math.random()) * radius;
		const px = Math.round(x + Math.cos(angle) * dist);
		const py = Math.round(y + Math.sin(angle) * dist);
		if (px >= 0 && px < width && py >= 0 && py < height) {
			ctx.fillRect(px, py, 1, 1);
		}
	}
}

export const behavior: ToolBehavior = {
	persistOnPointerUp: true,
	onPointerDown: ({ ctx, pos, primaryColor, brushSize }) => {
		drawSpray(ctx, pos.x, pos.y, primaryColor, brushSize);
	},
	onPointerMove: ({ ctx, pos, primaryColor, brushSize }) => {
		drawSpray(ctx, pos.x, pos.y, primaryColor, brushSize);
	}
};
