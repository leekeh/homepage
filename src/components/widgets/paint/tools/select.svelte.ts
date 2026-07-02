import IconDuplicate from '@icons/IconDuplicate.svelte';
import type { Component } from 'svelte';
import type { DrawingContext, ToolId, ToolBehavior } from './types';
import { clamp, normalizeRect, pointInRect, type Rect } from '../geometryUtils';

export const id: ToolId = 'select';
export const label = 'Selection';
export const icon: Component = IconDuplicate;

function drawSelectionOutline(ctx: CanvasRenderingContext2D, rect: Rect) {
	ctx.save();
	ctx.strokeStyle = '#19483a';
	ctx.lineWidth = 1;
	ctx.setLineDash([4, 2]);
	ctx.strokeRect(rect.x + 0.5, rect.y + 0.5, rect.width, rect.height);
	ctx.restore();
}

export function createSelectTool(options: {
	getCtx: () => CanvasRenderingContext2D | null;
	persist: () => void;
}) {
	let selectionRect = $state<Rect | null>(null);
	let previewRect: Rect | null = null;
	let selectionPixels: ImageData | null = null;
	let moving = false;
	let dragOffset = { x: 0, y: 0 };

	function clear() {
		selectionRect = null;
		previewRect = null;
		selectionPixels = null;
		moving = false;
	}

	const behavior: ToolBehavior = {
		requiresSnapshot: true,
		onPointerDown: ({ pos }: DrawingContext) => {
			previewRect = null;
			if (selectionRect && selectionPixels && pointInRect(pos.x, pos.y, selectionRect)) {
				moving = true;
				dragOffset = { x: pos.x - selectionRect.x, y: pos.y - selectionRect.y };
			} else {
				moving = false;
				selectionRect = null;
				selectionPixels = null;
			}
		},
		onPointerMove: ({ ctx, pos, startPos, snapshot }: DrawingContext) => {
			if (!snapshot) return;
			ctx.putImageData(snapshot, 0, 0);
			const { width: cw, height: ch } = ctx.canvas;

			if (moving && selectionRect && selectionPixels) {
				const nextRect: Rect = {
					x: clamp(pos.x - dragOffset.x, 0, cw - selectionRect.width),
					y: clamp(pos.y - dragOffset.y, 0, ch - selectionRect.height),
					width: selectionRect.width,
					height: selectionRect.height
				};
				previewRect = nextRect;
				ctx.fillStyle = '#ffffff';
				ctx.fillRect(selectionRect.x, selectionRect.y, selectionRect.width, selectionRect.height);
				ctx.putImageData(selectionPixels, nextRect.x, nextRect.y);
				drawSelectionOutline(ctx, nextRect);
			} else {
				const nextRect = normalizeRect(startPos.x, startPos.y, pos.x, pos.y);
				previewRect = nextRect;
				drawSelectionOutline(ctx, nextRect);
			}
		},
		onPointerUp: ({ ctx, snapshot }: DrawingContext) => {
			if (!snapshot) return;
			ctx.putImageData(snapshot, 0, 0);

			if (moving && selectionRect && selectionPixels && previewRect) {
				ctx.fillStyle = '#ffffff';
				ctx.fillRect(selectionRect.x, selectionRect.y, selectionRect.width, selectionRect.height);
				ctx.putImageData(selectionPixels, previewRect.x, previewRect.y);
				selectionRect = previewRect;
				options.persist();
			} else if (previewRect && previewRect.width > 1 && previewRect.height > 1) {
				selectionRect = previewRect;
				selectionPixels = ctx.getImageData(
					selectionRect.x,
					selectionRect.y,
					selectionRect.width,
					selectionRect.height
				);
			} else {
				selectionRect = null;
				selectionPixels = null;
			}

			moving = false;
			previewRect = null;
		}
	};

	function deleteSelection() {
		if (!selectionRect) return;
		const ctx = options.getCtx();
		if (!ctx) return;
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(selectionRect.x, selectionRect.y, selectionRect.width, selectionRect.height);
		options.persist();
		clear();
	}

	return {
		behavior,
		get selectionRect() {
			return selectionRect;
		},
		clear,
		deleteSelection
	};
}
