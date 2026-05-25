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
		index: number;
	};
	let { label, icon: Icon, id, href, index }: Props = $props();

	// Context
	const hasJsSupport = $derived(useJsSupport());
	const wm = $derived(useWindowManager());
	const iconPosition = $derived(wm.getIconPosition(id, index));

	// State
	let draggedPosition = $state<{ x: number; y: number } | null>(null);
	let dragging = $state(false);
	let offsetX = $state(0);
	let offsetY = $state(0);
	let suppressNextClick = $state(false);
	const x = $derived(draggedPosition?.x ?? iconPosition.x);
	const y = $derived(draggedPosition?.y ?? iconPosition.y);
	const iconStyles = $derived(hasJsSupport ? `position: absolute; left: ${x}px; top: ${y}px;` : '');

	// Drag logic
	const DRAG_THRESHOLD = 20;
	const drag = useDrag({
		threshold: DRAG_THRESHOLD,
		onStart: ({ event }) => {
			dragging = true;
			offsetX = event.clientX - x;
			offsetY = event.clientY - y;
		},
		onMove: ({ event }) => {
			const clamped = wm.clampIconPos(event.clientX - offsetX, event.clientY - offsetY);
			draggedPosition = clamped;
		},
		onEnd: ({ event, hasMoved }) => {
			if (hasMoved) {
				suppressNextClick = true;
				const droppedOverWindow = document
					.elementsFromPoint(event.clientX, event.clientY)
					.some((el) => el.closest('.window, .minimal-window'));

				if (!droppedOverWindow) {
					wm.moveIcon(id, x, y);
				}
			}
			dragging = false;
			draggedPosition = null;
		}
	});

	function onClick(e: MouseEvent) {
		if (suppressNextClick) {
			suppressNextClick = false;
			e.preventDefault();
			return;
		}
	}
</script>

<a
	class="desktop-icon"
	draggable="true"
	class:dragging
	href={resolve(href)}
	onclick={onClick}
	{@attach drag}
	style={iconStyles}
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
		border: var(--border-width) solid transparent;
		border-radius: var(--radius-md);
		padding: var(--space-3);
		cursor: pointer;
		width: 80px;
		touch-action: none;
		user-select: none;
		transition:
			background 0.1s,
			border-color 0.1s;

		&.dragging {
			opacity: 0.8;
			z-index: 9999;
		}

		&:hover {
			border: var(--border-width) solid var(--color-fg-highlight);
			background: var(--color-bg-preview);
		}
		&:active {
			background: var(--color-bg-highlight);
		}
	}

	.icon-image {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text-light);
		animation: var(--animation-squiggle);

		& :global(svg) {
			width: 56px;
			height: 48px;
		}
	}

	.icon-label {
		color: var(--color-text-light);
		background-color: var(--color-bg-primary);
		padding: 2px 4px;
		font-size: var(--font-size-sm);
		font-weight: 500;
		font-family: var(--font-mono);
		text-align: center;
		word-break: break-word;
		line-height: 1.2;
	}
</style>
