<script lang="ts">
	import type { Component } from 'svelte';
	import { useDrag } from '../shared/useDrag.svelte';
	import { useWindowManager } from '../shared/windowManager.svelte';
	import { useJsSupport } from '../shared/useJsSupport.svelte';
	import { resolve } from '$app/paths';
	import type { PathnameWithSearchOrHash } from '$app/types';

	type Props = {
		label: string;
		icon: Component;
		id: string;
		href: PathnameWithSearchOrHash;
	};
	let { label, icon: Icon, id, href }: Props = $props();

	const hasJsSupport = useJsSupport();
	const wm = useWindowManager();
	let { x, y } = $derived(wm.getIconPosition(id));
	let dragging = $state(false);
	let offsetX = $state(0);
	let offsetY = $state(0);
	let suppressNextClick = $state(false);

	const DRAG_THRESHOLD = 5;
	const ICON_W = 80;
	const ICON_H = 100;
	const TASKBAR_H = 36;

	// FIXME Dragging does not work, and also considering refactoring to use svelte attachments.
	const drag = useDrag({
		threshold: DRAG_THRESHOLD,
		onStart: ({ event }) => {
			dragging = true;
			offsetX = event.clientX - x;
			offsetY = event.clientY - y;
		},
		onMove: ({ event }) => {
			const maxX = window.innerWidth - ICON_W;
			const maxY = window.innerHeight - ICON_H - TASKBAR_H;
			x = Math.max(0, Math.min(event.clientX - offsetX, maxX));
			y = Math.max(0, Math.min(event.clientY - offsetY, maxY));
		},
		onEnd: ({ hasMoved }) => {
			dragging = false;
			if (hasMoved) {
				suppressNextClick = true;
				wm.moveIcon(id, x, y);
			}
		}
	});

	function onClick(e: MouseEvent) {
		if (suppressNextClick) {
			suppressNextClick = false;
			e.preventDefault();
			return;
		}
		e.preventDefault();
		wm.openWidget(id);
	}
</script>

<a
	class="desktop-icon"
	class:dragging
	class:positioned={hasJsSupport}
	href={resolve(href)}
	style={hasJsSupport ? `left: ${x}px; top: ${y}px;` : undefined}
	onclick={onClick}
	onpointerdown={drag.onPointerDown}
	onpointermove={drag.onPointerMove}
	onpointerup={drag.onPointerUp}
	onpointercancel={drag.onPointerCancel}
	onlostpointercapture={drag.onLostPointerCapture}
>
	<div class="icon-image">
		<Icon />
	</div>
	<span class="icon-label">{label}</span>
</a>

<style>
	.desktop-icon {
		position: static;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
		background: none;
		border: 1px solid transparent;
		border-radius: var(--radius-md);
		padding: var(--space-3);
		cursor: pointer;
		width: 80px;
		touch-action: none;
		user-select: none;
		transition:
			background 0.1s,
			border-color 0.1s;
	}

	.desktop-icon.positioned {
		position: absolute;
	}

	.desktop-icon.dragging {
		opacity: 0.8;
		z-index: 9999;
	}

	.desktop-icon:hover {
		background: rgba(212, 245, 214, 0.1);
		border-color: rgba(212, 245, 214, 0.2);
	}

	.desktop-icon:active {
		background: rgba(212, 245, 214, 0.2);
	}

	.icon-image {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text-light);
	}

	.icon-image :global(svg) {
		width: 32px;
		height: 32px;
	}

	.icon-label {
		color: var(--color-text-light);
		font-size: var(--font-size-sm);
		font-family: var(--font-mono);
		text-align: center;
		word-break: break-word;
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
		line-height: 1.2;
	}
</style>
