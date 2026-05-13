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
	threshold?: number;
	shouldStart?: (event: PointerEvent) => boolean;
	onStart?: (payload: DragPayload) => void;
	onMove?: (payload: DragPayload) => void;
	onEnd?: (payload: DragPayload & { reason: DragEndReason }) => void;
};

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
		captureElement.setPointerCapture(event.pointerId);

		options.onStart?.(payloadFor(event));
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

	return {
		onPointerDown,
		onPointerMove,
		onPointerUp,
		onPointerCancel,
		onLostPointerCapture
	};
}
