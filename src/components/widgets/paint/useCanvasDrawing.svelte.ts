import type { DrawPos, DrawingContext, ToolBehavior } from './tools/types';

export type CanvasDrawingParams = {
	getCtx: () => CanvasRenderingContext2D | null;
	getBehavior: () => ToolBehavior | undefined;
	getPrimaryColor: () => string;
	getBrushSize: () => number;
	persist: () => void;
	/** Called before any tool's pointerdown — return true to cancel default handling. */
	onBeforePointerDown?: (pos: DrawPos) => void;
};

/**
 * Generic canvas drawing attachment. Apply with `use:drawing.action` on a canvas element.
 * Manages pointer capture, RAF-throttled moves, and delegates to the active tool behavior.
 */
export function createCanvasDrawing(getParams: () => CanvasDrawingParams) {
	let isDrawing = $state(false);

	let startPos: DrawPos = { x: 0, y: 0 };
	let lastPos: DrawPos = { x: 0, y: 0 };
	let lastShiftKey = false;
	let snapshot: ImageData | null = null;

	let pendingMove: { pos: DrawPos; buttons: number; shiftKey: boolean; pointerId: number } | null =
		null;
	let rafFrame = 0;

	function getPos(canvas: HTMLCanvasElement, event: PointerEvent): DrawPos {
		const rect = canvas.getBoundingClientRect();
		const { width, height } = canvas;
		return {
			x: Math.min(width - 1, Math.max(0, Math.round(event.clientX - rect.left))),
			y: Math.min(height - 1, Math.max(0, Math.round(event.clientY - rect.top)))
		};
	}

	function makeContext(pos: DrawPos, shiftKey: boolean): DrawingContext | null {
		const params = getParams();
		const ctx = params.getCtx();
		if (!ctx) return null;
		return {
			ctx,
			pos,
			primaryColor: params.getPrimaryColor(),
			brushSize: params.getBrushSize(),
			startPos,
			shiftKey,
			snapshot,
			persist: params.persist
		};
	}

	function processPendingMove(move: {
		pos: DrawPos;
		buttons: number;
		shiftKey: boolean;
		pointerId: number;
	}) {
		lastPos = move.pos;
		lastShiftKey = move.shiftKey;

		if (isDrawing && move.buttons === 0) {
			finalizeDrawing(move.pointerId);
			return;
		}
		if (!isDrawing) return;

		const context = makeContext(move.pos, move.shiftKey);
		if (!context) return;
		getParams().getBehavior()?.onPointerMove?.(context);
	}

	function flushPending() {
		if (rafFrame !== 0) {
			cancelAnimationFrame(rafFrame);
			rafFrame = 0;
		}
		const move = pendingMove;
		pendingMove = null;
		if (move) processPendingMove(move);
	}

	function finalizeDrawing(pointerId?: number) {
		flushPending();
		if (pointerId !== undefined && _canvas?.hasPointerCapture(pointerId)) {
			// canvas reference captured in the action closure
			_canvas.releasePointerCapture(pointerId);
		}
		if (!isDrawing) return;

		const context = makeContext(lastPos, lastShiftKey);
		if (context) {
			const behavior = getParams().getBehavior();
			behavior?.onPointerUp?.(context);
			if (behavior?.persistOnPointerUp) {
				getParams().persist();
			}
			context.ctx.globalCompositeOperation = 'source-over';
		}

		isDrawing = false;
		snapshot = null;
		delete document.documentElement.dataset.interacting;
	}

	// Reference to the canvas element; set inside the action.
	let _canvas: HTMLCanvasElement | null = null;

	function action(canvas: HTMLCanvasElement) {
		_canvas = canvas;

		function onPointerDown(event: PointerEvent) {
			if (event.button !== 0) return;
			event.preventDefault();

			const params = getParams();
			const ctx = params.getCtx();
			if (!ctx) return;

			const pos = getPos(canvas, event);
			lastPos = pos;
			lastShiftKey = event.shiftKey;

			params.onBeforePointerDown?.(pos);

			const behavior = params.getBehavior();

			if (behavior?.instant) {
				const context = makeContext(pos, event.shiftKey);
				if (context) behavior.onPointerDown?.(context);
				return;
			}

			canvas.setPointerCapture(event.pointerId);
			isDrawing = true;
			document.documentElement.dataset.interacting = 'true';
			startPos = pos;

			snapshot = behavior?.requiresSnapshot
				? ctx.getImageData(0, 0, canvas.width, canvas.height)
				: null;

			const context = makeContext(pos, event.shiftKey);
			if (!context) return;

			behavior?.onPointerDown?.(context);

			if (behavior?.startsPath) {
				ctx.beginPath();
				ctx.moveTo(pos.x, pos.y);
			}
		}

		function onPointerMove(event: PointerEvent) {
			pendingMove = {
				pos: getPos(canvas, event),
				buttons: event.buttons,
				shiftKey: event.shiftKey,
				pointerId: event.pointerId
			};
			if (rafFrame !== 0) return;
			rafFrame = requestAnimationFrame(() => {
				rafFrame = 0;
				const move = pendingMove;
				pendingMove = null;
				if (move) processPendingMove(move);
			});
		}

		function onPointerUp(event: PointerEvent) {
			finalizeDrawing(event.pointerId);
		}

		function onWindowPointerEnd(event: PointerEvent) {
			if (!isDrawing) return;
			finalizeDrawing(event.pointerId);
		}

		canvas.addEventListener('pointerdown', onPointerDown);
		canvas.addEventListener('pointermove', onPointerMove);
		canvas.addEventListener('pointerup', onPointerUp);
		canvas.addEventListener('pointercancel', onPointerUp);
		canvas.addEventListener('pointerleave', onPointerUp);
		window.addEventListener('pointerup', onWindowPointerEnd, true);
		window.addEventListener('pointercancel', onWindowPointerEnd, true);

		return {
			destroy() {
				flushPending();
				_canvas = null;
				canvas.removeEventListener('pointerdown', onPointerDown);
				canvas.removeEventListener('pointermove', onPointerMove);
				canvas.removeEventListener('pointerup', onPointerUp);
				canvas.removeEventListener('pointercancel', onPointerUp);
				canvas.removeEventListener('pointerleave', onPointerUp);
				window.removeEventListener('pointerup', onWindowPointerEnd, true);
				window.removeEventListener('pointercancel', onWindowPointerEnd, true);
			}
		};
	}

	return {
		action,
		get isDrawing() {
			return isDrawing;
		}
	};
}
