import type { Attachment } from 'svelte/attachments';

type DragEndReason = 'pointerup' | 'pointercancel' | 'lostcapture';

type DragPayload = {
	event: PointerEvent;
	startX: number;
	startY: number;
	dx: number;
	dy: number;
	hasMoved: boolean;
};

type UseDragOptions = {
	/** Amount of movement (in pixels) required to start the drag */
	threshold?: number;
	/** Optional callback to determine if dragging should start based on the initial pointer event */
	shouldStart?: (event: PointerEvent) => boolean;
	/** Callback invoked when dragging starts */
	onStart?: (payload: DragPayload) => void;
	/** Callback invoked when dragging moves */
	onMove?: (payload: DragPayload) => void;
	/** Callback invoked when dragging ends */
	onEnd?: (payload: DragPayload & { reason: DragEndReason }) => void;
};

/**
 * Generates an attachment triggering drag events based on pointer interactions. Requires the user to manage the dragged element's position based on the provided callbacks.
 *
 * Usage:
 * ```svelte
 * <script lang="ts">
 *  import { useDrag } from './useDrag.svelte';
 * 	let x = $state(0);
 * 	let y = $state(0);
 *  const drag = useDrag({
 *   threshold: 5,
 *   onMove: ({ dx, dy }) => {
 *     x = dx;
 *     y = dy;
 *   },
 * });
 * </script>
 * 	<div {@attach drag} style="top: {y}px; left: {x}px; position: absolute;">Drag me!</div>
 * ```
 */
export function useDrag(options: UseDragOptions = {}) {
	const threshold = options.threshold ?? 0;

	let activePointerId: number | null = $state(null);
	let captureElement: HTMLElement | null = $state(null);
	let startX = $state(0);
	let startY = $state(0);
	let hasMoved = $state(false);
	let lastEvent: PointerEvent | null = $state(null);

	function payloadFor(event: PointerEvent): DragPayload {
		return {
			event,
			startX,
			startY,
			dx: event.clientX - startX,
			dy: event.clientY - startY,
			hasMoved
		};
	}

	function releaseCapture() {
		if (
			captureElement &&
			activePointerId !== null &&
			captureElement.hasPointerCapture(activePointerId)
		) {
			captureElement.releasePointerCapture(activePointerId);
		}
	}

	function reset() {
		activePointerId = null;
		captureElement = null;
		hasMoved = false;
		lastEvent = null;
	}

	function onPointerDown(event: PointerEvent) {
		if (event.button !== 0 || activePointerId !== null) return;
		if (options.shouldStart && !options.shouldStart(event)) return;

		startX = event.clientX;
		startY = event.clientY;
		hasMoved = false;
		lastEvent = event;
		activePointerId = event.pointerId;
		captureElement = event.currentTarget as HTMLElement;
		if (!captureElement) return;
		captureElement.setPointerCapture(event.pointerId);

		options.onStart?.(payloadFor(event));
		document.documentElement.dataset.interacting = 'true';
	}

	function onPointerMove(event: PointerEvent) {
		if (activePointerId === null || event.pointerId !== activePointerId) return;

		lastEvent = event;

		const dx = event.clientX - startX;
		const dy = event.clientY - startY;

		if (!hasMoved && Math.abs(dx) < threshold && Math.abs(dy) < threshold) {
			return;
		}

		hasMoved = true;
		options.onMove?.(payloadFor(event));
	}

	function finish(event: PointerEvent | null, reason: DragEndReason) {
		if (!lastEvent || activePointerId === null) return;
		if (event && event.pointerId !== activePointerId) return;

		const endEvent = event ?? lastEvent;
		const endPayload = payloadFor(endEvent);
		releaseCapture();
		options.onEnd?.({ ...endPayload, reason });
		reset();
		delete document.documentElement.dataset.interacting;
	}

	function onPointerUp(event: PointerEvent) {
		finish(event, 'pointerup');
	}

	function onPointerCancel(event: PointerEvent) {
		finish(event, 'pointercancel');
	}

	function onLostPointerCapture(event: PointerEvent) {
		finish(event, 'lostcapture');
	}

	function onDragStart(event: DragEvent) {
		// Disable native drag-and-drop, which would interfere with our custom dragging logic.
		event.preventDefault();
	}

	const dragAttachment: Attachment<HTMLElement> = (element) => {
		element.addEventListener('pointerdown', onPointerDown);
		element.addEventListener('pointermove', onPointerMove);
		element.addEventListener('pointerup', onPointerUp);
		element.addEventListener('pointercancel', onPointerCancel);
		element.addEventListener('lostpointercapture', onLostPointerCapture);
		element.addEventListener('dragstart', onDragStart);

		return () => {
			element.removeEventListener('pointerdown', onPointerDown);
			element.removeEventListener('pointermove', onPointerMove);
			element.removeEventListener('pointerup', onPointerUp);
			element.removeEventListener('pointercancel', onPointerCancel);
			element.removeEventListener('lostpointercapture', onLostPointerCapture);
			element.removeEventListener('dragstart', onDragStart);

			if (captureElement === element) {
				releaseCapture();
				reset();
			}
		};
	};

	return dragAttachment;
}
