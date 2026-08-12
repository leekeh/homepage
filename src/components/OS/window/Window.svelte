<script lang="ts">
	import type { Snippet } from 'svelte';
	import { useDrag } from '../shared/useDrag.svelte';
	import { useWindowManager, WindowManager } from '../shared/windowManager.svelte';
	import { useJsSupport } from '../shared/useJsSupport.svelte';
	import IconMinimize from '@icons/IconMinimize.svelte';
	import IconMaximize from '@icons/IconMaximize.svelte';
	import IconRestore from '@icons/IconRestore.svelte';
	import IconClose from '@icons/IconClose.svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	type Props = {
		id: string;
		title: string;
		icon?: string;
		x: number;
		y: number;
		width: number;
		height: number;
		zIndex: number;
		minimized?: boolean;
		maximized?: boolean;
		defaultMaximized?: boolean;
		resizable?: boolean;
		children: Snippet;
	};

	let {
		id,
		title,
		icon,
		x = $bindable(),
		y = $bindable(),
		width = $bindable(),
		height = $bindable(),
		defaultMaximized = false,
		zIndex,
		minimized = false,
		maximized = defaultMaximized,
		resizable = true,
		children
	}: Props = $props();

	// Context
	const wm = $derived(useWindowManager());
	const hasJsSupport = $derived(useJsSupport());
	const isActive = $derived(!hasJsSupport || wm.activeWindow?.id === id);
	const currentPath = $derived(page.url.pathname);

	// ── Resize state ──
	let resizing = $state(false);
	let isAnimating = $state(false);
	let snapPreview: 'top' | 'left' | 'right' | null = $state(null);

	// ── Drag state ──
	let dragging = $state(false);
	let dragOffX = 0;
	let dragOffY = 0;
	let draggingFromMaximized = false;
	let draggingFromSnapped = false;
	let snapRestoreSize: { width: number; height: number } | null = null;

	/** Pixels from edge that trigger snap preview */
	const SNAP_TOP_THRESHOLD = 8;
	const SNAP_SIDE_THRESHOLD = 8;
	/** Approximate cursor y-offset within the titlebar when restoring from maximized */
	const TITLEBAR_OFFSET = 16;

	const drag = useDrag({
		shouldStart: (event) => !(event.target as HTMLElement).closest('.titlebar-buttons'),
		onStart: ({ event }) => {
			dragging = true;
			snapPreview = null;
			draggingFromMaximized = maximized;
			draggingFromSnapped = !maximized && snapRestoreSize !== null;
			if (!maximized) {
				dragOffX = event.clientX - x;
				dragOffY = event.clientY - y;
			}
		},
		onMove: ({ event, dx, dy }) => {
			if (!dragging) return;

			if (draggingFromMaximized) {
				// Restore window once pointer has moved enough, keeping cursor proportional in titlebar
				if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
					const ratio = event.clientX / wm.desktopWidth;
					const restoredX = Math.round(event.clientX - ratio * width);
					const restoredY = event.clientY - TITLEBAR_OFFSET;
					wm.move(id, restoredX, restoredY);
					wm.toggleMaximize(id);
					dragOffX = event.clientX - restoredX;
					dragOffY = event.clientY - restoredY;
					draggingFromMaximized = false;
				}
				return;
			}

			if (draggingFromSnapped && snapRestoreSize) {
				// Restore pre-snap size once pointer has moved enough
				if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
					const { width: restW, height: restH } = snapRestoreSize;
					const ratio = event.clientX / wm.desktopWidth;
					const restoredX = Math.round(event.clientX - ratio * restW);
					const restoredY = event.clientY - TITLEBAR_OFFSET;
					wm.resize(id, restW, restH);
					wm.move(id, restoredX, restoredY);
					dragOffX = event.clientX - restoredX;
					dragOffY = event.clientY - restoredY;
					draggingFromSnapped = false;
					snapRestoreSize = null;
				}
				return;
			}

			const nextX = event.clientX - dragOffX;
			const nextY = event.clientY - dragOffY;
			wm.move(id, nextX, nextY);
			if (nextY <= SNAP_TOP_THRESHOLD) {
				snapPreview = 'top';
			} else if (event.clientX <= SNAP_SIDE_THRESHOLD) {
				snapPreview = 'left';
			} else if (event.clientX >= wm.desktopWidth - SNAP_SIDE_THRESHOLD) {
				snapPreview = 'right';
			} else {
				snapPreview = null;
			}
		},
		onEnd: () => {
			const prevSnap = snapPreview;
			dragging = false;
			draggingFromMaximized = false;
			draggingFromSnapped = false;
			snapPreview = null;

			if (prevSnap === 'top' && !maximized) {
				onToggleMaximize();
			} else if (prevSnap === 'left') {
				snapToHalf('left');
			} else if (prevSnap === 'right') {
				snapToHalf('right');
			}
		}
	});

	function createResizeAttachment(dir: string) {
		let startW = 0;
		let startH = 0;
		let startX = 0;
		let startY = 0;

		return useDrag({
			shouldStart: (event) => {
				if (!resizable || maximized) return false;
				event.stopPropagation();
				wm.focus(id);
				return true;
			},
			onStart: () => {
				resizing = true;
				snapRestoreSize = null;
				startW = width;
				startH = height;
				startX = x;
				startY = y;
			},
			onMove: ({ dx, dy }) => {
				let newW = startW;
				let newH = startH;
				let newX = startX;
				let newY = startY;

				if (dir.includes('e')) newW = startW + dx;
				if (dir.includes('s')) newH = startH + dy;
				if (dir.includes('w')) {
					newW = startW - dx;
					newX = startX + dx;
				}
				if (dir.includes('n')) {
					newH = startH - dy;
					newY = startY + dy;
				}

				if (newW >= 200 && newH >= 120) {
					wm.resize(id, newW, newH);
					wm.move(id, newX, newY);
				}
			},
			onEnd: () => {
				resizing = false;
			}
		});
	}

	const resizeDirections = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'] as const;
	type ResizeDirection = (typeof resizeDirections)[number];

	const resizeAttachments = Object.fromEntries(
		resizeDirections.map((dir) => [dir, createResizeAttachment(dir)])
	) as Record<ResizeDirection, ReturnType<typeof useDrag>>;

	// Window management
	function onFocus() {
		if (isActive) return;
		wm.focus(id);
	}

	function onMinimize() {
		wm.minimize(id);
	}

	function onToggleMaximize() {
		// set animation state before toggling to ensure transition runs when maximizing
		isAnimating = true;
		wm.toggleMaximize(id);
		// Clear animation state after transition duration (300ms)
		setTimeout(() => (isAnimating = false), 300);
	}

	function snapToHalf(side: 'left' | 'right') {
		snapRestoreSize = { width, height };
		isAnimating = true;
		const halfWidth = Math.floor(wm.desktopWidth / 2);
		const snapHeight = wm.desktopHeight - WindowManager.TASKBAR_H;
		wm.resize(id, halfWidth, snapHeight);
		wm.move(id, side === 'right' ? halfWidth : 0, 0);
		setTimeout(() => (isAnimating = false), 300);
	}

	function onClose() {
		wm.close(id);
	}
</script>

<!-- 
@component
OS-style window with title bar, optional menubar, and content area. Supports dragging, resizing, maximizing, minimizing, and closing.
 -->

<section
	class={['window squiggle-border', maximized, minimized, resizing, !hasJsSupport && 'no-js']}
	style="
		left: {maximized ? 0 : x}px;
		top: {maximized ? 0 : y}px;
		width: {maximized ? '100%' : `${width}px`};
		height: {maximized ? `calc(100% - var(--taskbar-height))` : `${height}px`};
		z-index: {zIndex};
        transition: {isAnimating ? 'all 0.3s ease' : 'none'};
	"
	onpointerdown={onFocus}
	aria-hidden={!isActive}
	aria-labelledby={`window-title-${id}`}
>
	<!-- Title Bar -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<header class="titlebar" {@attach drag} ondblclick={onToggleMaximize} draggable={hasJsSupport}>
		<div class="titlebar-left">
			{#if icon}
				<span class="title-icon">{icon}</span>
			{/if}
			<h2 class="title-text" id={`window-title-${id}`}>{title}</h2>
		</div>
		<div class="titlebar-buttons" inert={!isActive}>
			{#if hasJsSupport}
				<button type="button" class="wbtn" onclick={onMinimize} title="Minimize">
					<IconMinimize />
				</button>
				<button
					type="button"
					class="wbtn"
					onclick={onToggleMaximize}
					title={maximized ? 'Restore' : 'Maximize'}
				>
					{#if maximized}
						<IconRestore />
					{:else}
						<IconMaximize />
					{/if}
				</button>
			{/if}
			{#if hasJsSupport}
				<button
					type="button"
					class="wbtn close-btn"
					onclick={onClose}
					title="Close"
					aria-label="Close"
				>
					<IconClose />
				</button>
			{:else if currentPath !== '/'}
				<a class="wbtn close-btn" href={resolve('/')} title="Close" aria-label="Close">
					<IconClose />
				</a>
			{/if}
		</div>
	</header>

	<!-- Content area -->
	<div class="window-content" inert={!isActive}>
		{@render children()}
	</div>

	<!-- Resize handles -->
	{#if resizable && hasJsSupport && !maximized}
		{#each resizeDirections as dir (dir)}
			<div class={`resize-handle ${dir}`} {@attach resizeAttachments[dir]}></div>
		{/each}
	{/if}
</section>

{#if snapPreview}
	<div class="snap-preview {snapPreview}" aria-hidden="true"></div>
{/if}

<style>
	.window {
		position: absolute;
		display: flex;
		flex-direction: column;
		min-width: 200px;
		min-height: 120px;
		border-radius: var(--radius-lg);
		container-type: inline-size;
		box-shadow:
			rgba(17, 17, 26, 0.1) 0px 4px 16px,
			rgba(17, 17, 26, 0.1) 0px 8px 24px,
			rgba(17, 17, 26, 0.1) 0px 16px 56px;
		&.maximized {
			border-radius: 0;
			border: none;
		}

		&::before {
			background-color: var(--color-bg-primary);
		}

		&.no-js {
			overflow: hidden;
			resize: both;
		}
	}

	.snap-preview {
		position: fixed;
		inset: var(--border-width) var(--border-width) var(--taskbar-height) var(--border-width);
		pointer-events: none;
		border: var(--border-width) solid var(--color-fg-highlight);
		border-radius: var(--radius-lg);
		background: var(--color-bg-preview);
		outline-offset: (-1 * var(--border-width));
		animation: snap-preview-in 140ms ease-out;
		animation-fill-mode: forwards;

		&.left {
			inset: var(--border-width) 50% var(--taskbar-height) var(--border-width);
		}

		&.right {
			inset: var(--border-width) var(--border-width) var(--taskbar-height) 50%;
		}
	}

	@keyframes snap-preview-in {
		from {
			opacity: 0;
			transform: scale(0.8);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.titlebar {
		display: flex;
		position: relative;
		border-radius: inherit;
		align-items: center;
		justify-content: space-between;
		min-height: var(--titlebar-height);
		flex-shrink: 0;
		padding: 4px;

		&::before {
			--inset: 8px;
			--calculated-radius: calc(var(--radius-lg) - var(--inset));
			content: '';
			position: absolute;
			inset: var(--inset);
			border-radius: var(--calculated-radius) var(--calculated-radius) 1px 1px;
			background: var(--color-bg-highlight);
			z-index: -1;
		}

		&[draggable='true'] {
			cursor: grab;
			user-select: none;
			touch-action: none;
			&:active {
				cursor: grabbing;
			}
		}
	}

	.titlebar-left {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		overflow: hidden;
		padding: var(--space-2) var(--space-5);
	}

	.title-icon {
		font-size: var(--font-size-md);
		flex-shrink: 0;
	}

	.title-text {
		font-family: var(--font-mono);
		font-weight: 600;
		font-size: var(--font-size-lg);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.titlebar-buttons {
		display: flex;
		flex-shrink: 0;
	}

	.wbtn {
		width: 38px;
		height: 38px;
		border: none;
		background-color: transparent;
		background-image: radial-gradient(circle at center, transparent 0%, transparent 80%);
		color: var(--color-fg-primary);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 10px;
		border-radius: var(--radius-round);
		filter: var(--filter-squiggle);
		--box-shadow-color: transparent;
		box-shadow: inset 0 0 0 4px var(--box-shadow-color);

		&:hover {
			--box-shadow-color: var(--color-bg-primary);
		}

		&.close-btn:hover {
			--box-shadow-color: #ff8989;
		}
	}

	/* ── Menu Bar ── */
	.menubar {
		display: flex;
		padding: var(--space-1) var(--space-2);
		min-height: var(--menubar-height);
		flex-shrink: 0;
	}

	/* ── Content ── */
	.window-content {
		flex: 1;
		overflow: auto;
		overscroll-behavior: none;
		position: relative;
		border-radius: inherit;
	}

	/* ── Resize Handles ── */
	.resize-handle {
		position: absolute;
		--handler-size: 16px;
		--handler-offset: calc(-1 * var(--handler-size) / 2);
	}

	.resize-handle.n {
		top: var(--handler-offset);
		left: var(--handler-offset);
		right: var(--handler-offset);
		height: var(--handler-size);
		cursor: n-resize;
	}
	.resize-handle.s {
		bottom: var(--handler-offset);
		left: var(--handler-offset);
		right: var(--handler-offset);
		height: var(--handler-size);
		cursor: s-resize;
	}
	.resize-handle.e {
		right: var(--handler-offset);
		top: var(--handler-offset);
		bottom: var(--handler-offset);
		width: var(--handler-size);
		cursor: e-resize;
	}
	.resize-handle.w {
		left: var(--handler-offset);
		top: var(--handler-offset);
		bottom: var(--handler-offset);
		width: var(--handler-size);
		cursor: w-resize;
	}
	.resize-handle.ne {
		z-index: 1;
		top: var(--handler-offset);
		right: var(--handler-offset);
		width: var(--handler-size);
		height: var(--handler-size);
		cursor: ne-resize;
	}
	.resize-handle.nw {
		z-index: 1;
		top: var(--handler-offset);
		left: var(--handler-offset);
		width: var(--handler-size);
		height: var(--handler-size);
		cursor: nw-resize;
	}
	.resize-handle.se {
		z-index: 1;
		bottom: var(--handler-offset);
		right: var(--handler-offset);
		width: var(--handler-size);
		height: var(--handler-size);
		cursor: se-resize;
	}
	.resize-handle.sw {
		z-index: 1;
		bottom: var(--handler-offset);
		left: var(--handler-offset);
		width: var(--handler-size);
		height: var(--handler-size);
		cursor: sw-resize;
	}
</style>
