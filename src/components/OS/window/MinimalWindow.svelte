<script lang="ts">
	import type { Snippet } from 'svelte';
	import { useDrag } from '../shared/useDrag.svelte';
	import { useWindowManager } from '../shared/windowManager.svelte';
	import IconClose from '@icons/IconClose.svelte';
	import { useJsSupport } from '../shared/useJsSupport.svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	type Props = {
		id: string;
		x: number;
		y: number;
		width: number;
		height: number;
		zIndex: number;
		title: string;
		children: Snippet;
	};

	let {
		id,
		x = $bindable(),
		y = $bindable(),
		width,
		height,
		zIndex,
		title,
		children
	}: Props = $props();

	// Context
	const wm = $derived(useWindowManager());
	const hasJsSupport = $derived(useJsSupport());
	const currentPath = $derived(page.url.pathname);

	// State
	let dragOffX = $state(0);
	let dragOffY = $state(0);

	// Interactions
	const drag = useDrag({
		shouldStart: (event) =>
			!(
				(event.target as HTMLElement).closest('button') ||
				(event.target as HTMLElement).closest('a')
			),
		onStart: ({ event }) => {
			wm.focus(id);
			dragOffX = event.clientX - x;
			dragOffY = event.clientY - y;
		},
		onMove: ({ event }) => {
			wm.move(id, event.clientX - dragOffX, event.clientY - dragOffY);
		}
	});

	function onClose() {
		wm.close(id);
	}
</script>

<!-- 
	@component
	Window without built-in title bar. Minimal, stylistic widgets that should not be resized and should not look like traditional windows.
 -->

<section
	class="minimal-window"
	style="
		left: {x}px;
		top: {y}px;
		width: {width}px;
		height: {height}px;
		z-index: {zIndex};
	"
	draggable="true"
	{@attach drag}
	aria-label={title}
>
	{#if hasJsSupport}
		<button class="minimal-close" onclick={onClose} title="Close">
			<IconClose />
		</button>
	{:else if currentPath !== '/'}
		<a class="minimal-close" href={resolve('/')} title="Close">
			<IconClose />
		</a>
	{/if}

	<div class="minimal-content">
		{@render children()}
	</div>
</section>

<style>
	.minimal-window {
		position: absolute;
		border-radius: var(--radius-lg);
		overflow: hidden;
		touch-action: none;
		cursor: grab;
		:global(a),
		:global(button) {
			cursor: pointer;
		}
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
