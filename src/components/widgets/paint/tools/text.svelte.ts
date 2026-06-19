import IconText from '@icons/IconText.svelte';
import { tick } from 'svelte';
import type { Component } from 'svelte';
import type { DrawingContext, ToolId, ToolBehavior } from './types';
import { clamp } from '../geometryUtils';

export const id: ToolId = 'text';
export const label = 'Text';
export const icon: Component = IconText;

export function createTextTool(options: {
	getCanvasWrap: () => HTMLDivElement | undefined;
	getCtx: () => CanvasRenderingContext2D | null;
	getPrimaryColor: () => string;
	getBrushSize: () => number;
	getInputEl: () => HTMLInputElement | undefined;
	persist: () => void;
}) {
	let visible = $state(false);
	let value = $state('');
	let x = $state(0);
	let y = $state(0);
	let dragging = $state(false);

	let dragOffsetX = 0;
	let dragOffsetY = 0;

	const inputSize = $derived(value.length + 1);

	function getFontSize(): number {
		return Math.max(12, options.getBrushSize() * 4);
	}

	function getFontFamily(): string {
		const inputEl = options.getInputEl();
		if (inputEl) return getComputedStyle(inputEl).fontFamily;
		const wrap = options.getCanvasWrap();
		if (wrap) return getComputedStyle(wrap).fontFamily;
		return 'sans-serif';
	}

	function getBounds() {
		const canvasWrap = options.getCanvasWrap();
		const inputEl = options.getInputEl();
		const viewportWidth = Math.max(1, canvasWrap?.clientWidth ?? 0);
		const viewportHeight = Math.max(1, canvasWrap?.clientHeight ?? 0);
		const width = inputEl?.offsetWidth ?? 0;
		const height = inputEl?.offsetHeight ?? Math.max(getFontSize() + 8, 24);
		return { width, height, viewportWidth, viewportHeight };
	}

	function constrainPosition(nextX: number, nextY: number) {
		const { width, height, viewportWidth, viewportHeight } = getBounds();
		return {
			x: clamp(nextX, 0, Math.max(0, viewportWidth - width)),
			y: clamp(nextY, 0, Math.max(0, viewportHeight - height))
		};
	}

	async function start(startX: number, startY: number) {
		value = '';
		x = startX;
		y = startY;
		visible = true;
		await tick();
		const constrained = constrainPosition(x, y);
		x = constrained.x;
		y = constrained.y;
		options.getInputEl()?.focus();
	}

	function drawText() {
		const ctx = options.getCtx();
		if (!ctx || !value) return;
		ctx.fillStyle = options.getPrimaryColor();
		ctx.font = `${getFontSize()}px ${getFontFamily()}`;
		ctx.textBaseline = 'top';
		ctx.fillText(value.trimEnd(), x, y);
		options.persist();
	}

	function commit() {
		if (!visible) return;
		drawText();
		visible = false;
		value = '';
		dragging = false;
	}

	function cancel() {
		visible = false;
		value = '';
		dragging = false;
	}

	async function syncPosition() {
		await tick();
		const constrained = constrainPosition(x, y);
		x = constrained.x;
		y = constrained.y;
	}

	function onPointerDown(event: PointerEvent) {
		if (event.button !== 0) return;
		event.preventDefault();
		event.stopPropagation();
		const canvasWrap = options.getCanvasWrap();
		if (!canvasWrap) return;
		const wrapRect = canvasWrap.getBoundingClientRect();
		dragging = true;
		dragOffsetX = event.clientX - wrapRect.left - x;
		dragOffsetY = event.clientY - wrapRect.top - y;
		options.getInputEl()?.setPointerCapture(event.pointerId);
		options.getInputEl()?.focus();
	}

	function onPointerMove(event: PointerEvent) {
		if (!dragging) return;
		const canvasWrap = options.getCanvasWrap();
		if (!canvasWrap || !options.getInputEl()) return;
		const wrapRect = canvasWrap.getBoundingClientRect();
		const constrained = constrainPosition(
			event.clientX - wrapRect.left - dragOffsetX,
			event.clientY - wrapRect.top - dragOffsetY
		);
		x = constrained.x;
		y = constrained.y;
	}

	function onPointerUp(event: PointerEvent) {
		if (!dragging) return;
		dragging = false;
		const inputEl = options.getInputEl();
		if (inputEl?.hasPointerCapture(event.pointerId)) {
			inputEl.releasePointerCapture(event.pointerId);
		}
	}

	const behavior: ToolBehavior = {
		instant: true,
		onPointerDown: ({ pos }: DrawingContext) => {
			if (visible) commit();
			void start(pos.x, pos.y);
		}
	};

	return {
		behavior,
		get visible() {
			return visible;
		},
		get value() {
			return value;
		},
		set value(v: string) {
			value = v;
		},
		get x() {
			return x;
		},
		get y() {
			return y;
		},
		get inputSize() {
			return inputSize;
		},
		get dragging() {
			return dragging;
		},
		getFontFamily,
		getFontSize,
		syncPosition,
		commit,
		cancel,
		onPointerDown,
		onPointerMove,
		onPointerUp
	};
}
