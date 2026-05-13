<script lang="ts">
	import type { Snippet } from 'svelte';
	import { useDrag } from '../shared/useDrag.svelte';
	import { useWindowManager } from '../shared/windowManager.svelte';
	import IconMinimize from '@icons/IconMinimize.svelte';
	import IconMaximize from '@icons/IconMaximize.svelte';
	import IconRestore from '@icons/IconRestore.svelte';
	import IconClose from '@icons/IconClose.svelte';

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
		menubar?: Snippet;
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
		children,
		menubar
	}: Props = $props();

	// Context
	const wm = useWindowManager();
	const isActive = $derived(wm.activeWindow?.id === id);

	// ── Resize state ──
	let resizing = $state(false);
	let isAnimating = $state(false);
	let showBottomSnapPreview = $state(false);
	let draggingMaximized = $state(false);
	let maximizeDragStartY = 0;
	let showMinimizePreview = $state(false);

	// ── Drag state ──
	let dragging = $state(false);
	let dragOffX = 0;
	let dragOffY = 0;

	const MAXIMIZED_MINIMIZE_THRESHOLD = 72;

	const drag = useDrag({
		shouldStart: (event) => !(event.target as HTMLElement).closest('.titlebar-buttons'),
		onStart: ({ event }) => {
			dragging = true;
			showBottomSnapPreview = false;
			showMinimizePreview = false;

			if (maximized) {
				draggingMaximized = true;
				maximizeDragStartY = event.clientY;
				return;
			}

			draggingMaximized = false;
			dragOffX = event.clientX - x;
			dragOffY = event.clientY - y;
		},
		onMove: ({ event, dy }) => {
			if (!dragging) return;

			if (draggingMaximized) {
				showMinimizePreview = dy >= MAXIMIZED_MINIMIZE_THRESHOLD;
				showBottomSnapPreview = false;
			} else {
				const nextX = event.clientX - dragOffX;
				const nextY = event.clientY - dragOffY;
				wm.move(id, nextX, nextY);
				showBottomSnapPreview = !maximized && shouldShowBottomSnapPreview();
			}
		},
		onEnd: ({ event }) => {
			const shouldMaximize = dragging && !draggingMaximized && showBottomSnapPreview && !maximized;
			const maximizeDragDeltaY = event.clientY - maximizeDragStartY;
			const shouldMinimizeFromMaximized =
				dragging &&
				draggingMaximized &&
				maximizeDragDeltaY >= MAXIMIZED_MINIMIZE_THRESHOLD &&
				maximized;

			dragging = false;
			draggingMaximized = false;
			showBottomSnapPreview = false;
			showMinimizePreview = false;

			if (shouldMaximize) {
				onToggleMaximize();
			} else if (shouldMinimizeFromMaximized) {
				onMinimize();
			}
		}
	});

	function shouldShowBottomSnapPreview() {
		// todo move this to window manager logic.
		// const maxWindowY = wm.desktopHeight - WindowManager.TASKBAR_H - height;
		// return nextY >= maxWindowY - 28;
		return false;
	}

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
				showBottomSnapPreview = false;
				showMinimizePreview = false;
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
				showBottomSnapPreview = false;
				showMinimizePreview = false;
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

	function onClose() {
		wm.close(id);
	}
</script>

<!-- 
@component
OS-style window with title bar, optional menubar, and content area. Supports dragging, resizing, maximizing, minimizing, and closing.
 -->

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	class="window"
	class:maximized
	class:minimized
	class:resizing
	class:inactive={!isActive}
	tabindex={isActive ? 0 : -1}
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
>
	<!-- Title Bar -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="titlebar" {@attach drag} ondblclick={onToggleMaximize} draggable="true">
		<div class="titlebar-left">
			{#if icon}
				<span class="title-icon">{icon}</span>
			{/if}
			<span class="title-text">{title}</span>
		</div>
		<div class="titlebar-buttons">
			<button class="wbtn" onclick={onMinimize} title="Minimize">
				<IconMinimize />
			</button>
			<button class="wbtn" onclick={onToggleMaximize} title={maximized ? 'Restore' : 'Maximize'}>
				{#if maximized}
					<IconRestore />
				{:else}
					<IconMaximize />
				{/if}
			</button>
			<button class="wbtn close-btn" onclick={onClose} title="Close">
				<IconClose />
			</button>
		</div>
	</div>

	<!-- Menu Bar (optional snippet) -->
	{#if menubar}
		<div class="menubar">
			{@render menubar()}
		</div>
	{/if}

	<!-- Content area -->
	<div class="window-content">
		{@render children()}
	</div>

	<!-- Resize handles -->
	{#if resizable && !maximized}
		{#each resizeDirections as dir (dir)}
			<div class={`resize-handle ${dir}`} {@attach resizeAttachments[dir]}></div>
		{/each}
	{/if}
</div>

{#if showBottomSnapPreview}
	<div class="snap-preview" aria-hidden="true"></div>
{/if}

{#if showMinimizePreview}
	<div class="minimize-preview" aria-hidden="true"></div>
{/if}

<style>
	.window {
		position: absolute;
		display: flex;
		flex-direction: column;
		min-width: 200px;
		min-height: 120px;
		box-shadow: var(--shadow-window);
		border: 1px solid var(--win-border);
		border-radius: var(--radius-lg);
		overflow: hidden;
		container-type: inline-size;
	}

	.window.maximized {
		border-radius: 0;
		border: none;
	}

	.window.resizing {
		user-select: none;
	}

	.snap-preview {
		position: fixed;
		inset: 0 0 var(--taskbar-height) 0;
		z-index: var(--z-overlay);
		pointer-events: none;
		border: 2px solid #d4f5d688;
		border-radius: var(--radius-lg);
		background: linear-gradient(135deg, #d4f5d61a 0%, #5ccc631a 100%);
		box-shadow: 0 0 0 1px #003d04aa inset;
		animation: snap-preview-in 140ms ease-out;
	}

	.minimize-preview {
		position: fixed;
		left: 50%;
		bottom: calc(var(--taskbar-height) + 8px);
		transform: translateX(-50%);
		width: min(320px, 80vw);
		height: 18px;
		border-radius: var(--radius-round);
		border: 1px solid #d4f5d688;
		background: linear-gradient(90deg, #5ccc6333 0%, #d4f5d666 100%);
		box-shadow: 0 0 0 1px #003d04aa inset;
		z-index: var(--z-overlay);
		pointer-events: none;
		animation: snap-preview-in 140ms ease-out;
	}

	@keyframes snap-preview-in {
		from {
			opacity: 0;
			transform: scale(0.985);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.window.inactive {
		opacity: 0.8;
		box-shadow:
			0 0 0 1px var(--color-border-dark),
			0 2px 16px #00000044;
		.window-content {
			pointer-events: none;
		}
	}

	.inactive {
		/* add blurry overlay for inactive windows */
		&::before {
			content: '';
			position: absolute;
			inset: 0;
			backdrop-filter: blur(3px);
			pointer-events: none;
		}
	}

	/* ── Title Bar ── */
	.titlebar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-image: var(--bg-gradient);
		backdrop-filter: blur(5px);
		cursor: default;
		min-height: var(--titlebar-height);
		touch-action: none;
		flex-shrink: 0;
		cursor: grab;
		user-select: none;
		&:active {
			cursor: grabbing;
		}
	}

	.inactive .titlebar {
		background-image: var(--bg-gradient);
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
		color: var(--win-titlebar-text);
		font-family: var(--font-sans);
		font-size: var(--font-size-base);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.inactive .title-text {
		color: var(--win-titlebar-text-inactive);
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
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 10px;
		border-radius: var(--radius-round);
		transition: all ease 0.3s;
	}

	.wbtn:hover {
		background-image: radial-gradient(circle at center, #ffffff88 0%, transparent 80%);
	}

	.close-btn:hover {
		background-image: radial-gradient(circle at center, #ff898988 0%, transparent 80%);
	}

	/* ── Menu Bar ── */
	.menubar {
		display: flex;
		background: var(--win-menubar);
		border-bottom: 1px solid var(--win-menubar-border);
		padding: var(--space-1) var(--space-2);
		min-height: var(--menubar-height);
		flex-shrink: 0;
	}

	/* ── Content ── */
	.window-content {
		flex: 1;
		overflow: auto;
		overscroll-behavior: none;
		scrollbar-color: var(--win-btn-bg) transparent;
		scrollbar-width: 10px;
		background: var(--win-bg);
	}

	/* ── Resize Handles ── */
	.resize-handle {
		position: absolute;
	}

	.resize-handle.n {
		top: -3px;
		left: 6px;
		right: 6px;
		height: 6px;
		cursor: n-resize;
	}
	.resize-handle.s {
		bottom: -3px;
		left: 6px;
		right: 6px;
		height: 6px;
		cursor: s-resize;
	}
	.resize-handle.e {
		right: -3px;
		top: 6px;
		bottom: 6px;
		width: 6px;
		cursor: e-resize;
	}
	.resize-handle.w {
		left: -3px;
		top: 6px;
		bottom: 6px;
		width: 6px;
		cursor: w-resize;
	}
	.resize-handle.ne {
		top: -3px;
		right: -3px;
		width: 12px;
		height: 12px;
		cursor: ne-resize;
	}
	.resize-handle.nw {
		top: -3px;
		left: -3px;
		width: 12px;
		height: 12px;
		cursor: nw-resize;
	}
	.resize-handle.se {
		bottom: -3px;
		right: -3px;
		width: 12px;
		height: 12px;
		cursor: se-resize;
	}
	.resize-handle.sw {
		bottom: -3px;
		left: -3px;
		width: 12px;
		height: 12px;
		cursor: sw-resize;
	}
</style>
