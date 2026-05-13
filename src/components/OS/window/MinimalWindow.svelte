<script lang="ts">
	import type { Snippet } from 'svelte';
	import { useDrag } from '../shared/useDrag.svelte';
	import { useWindowManager } from '../shared/windowManager.svelte';
	import IconClose from '@icons/IconClose.svelte';

	type Props = {
		id: string;
		x: number;
		y: number;
		width: number;
		height: number;
		zIndex: number;
		children: Snippet;
	};

	let { id, x = $bindable(), y = $bindable(), width, height, zIndex, children }: Props = $props();

	const wm = useWindowManager();

	let dragging = $state(false);
	let dragOffX = 0;
	let dragOffY = 0;

	const drag = useDrag({
		onStart: ({ event }) => {
			wm.focus(id);
			dragging = true;
			dragOffX = event.clientX - x;
			dragOffY = event.clientY - y;
		},
		onMove: ({ event }) => {
			wm.move(id, event.clientX - dragOffX, event.clientY - dragOffY);
		},
		onEnd: () => {
			dragging = false;
		}
	});

	function onPointerDown(e: PointerEvent) {
		drag.onPointerDown(e);
	}

	function onPointerMove(e: PointerEvent) {
		drag.onPointerMove(e);
	}

	function onPointerUp(e: PointerEvent) {
		drag.onPointerUp(e);
	}

	function onClose() {
		wm.close(id);
	}
</script>

<svelte:window onpointermove={onPointerMove} onpointerup={onPointerUp} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="minimal-window"
	style="
		left: {x}px;
		top: {y}px;
		width: {width}px;
		height: {height}px;
		z-index: {zIndex};
	"
	onpointerdown={onPointerDown}
	onpointercancel={drag.onPointerCancel}
	onlostpointercapture={drag.onLostPointerCapture}
>
	<button class="minimal-close" onclick={onClose} title="Close">
		<IconClose />
	</button>

	<div class="minimal-content">
		{@render children()}
	</div>
</div>

<style>
	.minimal-window {
		position: absolute;
		background: rgba(0, 20, 2, 0.65);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid rgba(212, 245, 214, 0.2);
		border-radius: var(--radius-lg);
		overflow: hidden;
		touch-action: none;
		cursor: grab;
	}

	.minimal-window:active {
		cursor: grabbing;
	}

	.minimal-close {
		position: absolute;
		top: var(--space-2);
		right: var(--space-2);
		width: 18px;
		height: 18px;
		border: none;
		background: rgba(255, 255, 255, 0.1);
		color: var(--color-text-light);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		border-radius: 50%;
		opacity: 0;
		transition: opacity 0.2s;
		z-index: 1;
	}

	.minimal-window:hover .minimal-close {
		opacity: 1;
	}

	.minimal-close:hover {
		background: var(--color-error);
	}

	.minimal-content {
		width: 100%;
		height: 100%;
		overflow: hidden;
		color: var(--color-text-light);
	}
</style>
