<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext, onMount } from 'svelte';
	import { WindowManager, WM_CONTEXT_KEY, NAVIGATE_KEY } from '../shared/windowManager.svelte';
	import { getWidgetById, loadWidgetComponent, widgetNavigationData } from '../../widgets/widgets';
	import Window from '../window/Window.svelte';
	import MinimalWindow from '../window/MinimalWindow.svelte';
	import DesktopIcon from '../desktop/DesktopIcon.svelte';
	import IconStart from '@icons/IconStart.svelte';
	import { useJsSupport } from '../shared/useJsSupport.svelte';
	import { useTime } from '../shared/useTime.svelte';

	type Props = {
		children?: Snippet;
	};

	let { children }: Props = $props();

	const wm = getContext<WindowManager>(WM_CONTEXT_KEY);
	const navigate =
		getContext<(widgetId: string, data?: Record<string, unknown>) => void>(NAVIGATE_KEY);

	const hasJsSupport = useJsSupport();

	onMount(() => {
		wm.seedIconDefaults(widgetNavigationData);
	});

	const START_MENU_ID = 'desktop-start-menu';

	function openWidget(widgetId: string, data?: Record<string, unknown>) {
		navigate(widgetId, data);
	}

	function focusWindow(id: string) {
		const win = wm.windows.find((w) => w.id === id);
		if (win?.minimized) win.minimized = false;
		wm.focus(id);
	}

	function onStartItemClick(event: MouseEvent, widgetId: string) {
		event.preventDefault();
		openWidget(widgetId);
		const popover = document.getElementById(START_MENU_ID) as
			| (HTMLElement & { hidePopover?: () => void })
			| null;
		popover?.hidePopover?.();
	}

	let time = $derived(useTime());
</script>

<div class="desktop-shell">
	<div class="desktop-icons" class:no-js={!hasJsSupport}>
		{#each widgetNavigationData as widget (widget.id)}
			<DesktopIcon id={widget.id} label={widget.title} icon={widget.icon} href={widget.route} />
		{/each}
	</div>

	{@render children?.()}
	{#each wm.windows as win (win.id)}
		{#if !win.minimized}
			{#if win.minimal}
				<MinimalWindow
					id={win.id}
					bind:x={win.x}
					bind:y={win.y}
					width={win.width}
					height={win.height}
					zIndex={win.zIndex}
				>
					{@const WidgetComponent = await loadWidgetComponent(win.widgetId)}
					{#if WidgetComponent}
						<WidgetComponent {...win.data ?? {}} />
					{/if}
				</MinimalWindow>
			{:else}
				{@const def = getWidgetById(win.widgetId)}
				<Window
					id={win.id}
					title={win.title}
					bind:x={win.x}
					bind:y={win.y}
					bind:width={win.width}
					bind:height={win.height}
					zIndex={win.zIndex}
					minimized={win.minimized}
					maximized={win.maximized}
					defaultMaximized={def?.defaultMaximized}
					resizable={def?.resizable ?? true}
				>
					{@const WidgetComponent = await loadWidgetComponent(win.widgetId)}
					{#if WidgetComponent}
						<WidgetComponent {...win.data ?? {}} />
					{/if}
				</Window>
			{/if}
		{/if}
	{/each}

	<footer class="taskbar">
		<button
			class="start-button"
			type="button"
			popovertarget={START_MENU_ID}
			popovertargetaction="toggle"
		>
			<IconStart />
			<span>Start</span>
		</button>

		<div class="divider"></div>

		<div class="window-buttons">
			{#each wm.windows as win (win.id)}
				{@const isActive = wm.activeWindow?.id === win.id && !win.minimized}
				<button
					class="window-button"
					class:active={isActive}
					class:minimized={win.minimized}
					onclick={() => focusWindow(win.id)}
					title={win.title}
				>
					<span class="window-button-text">{win.title}</span>
				</button>
			{/each}
		</div>

		<div class="clock-area">
			<time class="clock" datetime={time}>{time}</time>
		</div>
	</footer>

	<div class="start-popover" id={START_MENU_ID} popover>
		<div class="start-menu-sidebar">
			<span class="sidebar-text">lieke.dev</span>
		</div>
		<nav class="start-menu-items" aria-label="Applications">
			{#each widgetNavigationData as widget (widget.id)}
				<a
					class="start-menu-item"
					href={widget.route}
					onclick={(e) => onStartItemClick(e, widget.id)}
				>
					<span class="start-menu-icon" aria-hidden="true">
						<widget.icon />
					</span>
					<span class="start-menu-label">{widget.title}</span>
				</a>
			{/each}
		</nav>
	</div>
</div>

<style>
	.desktop-shell {
		position: absolute;
		inset: 0;
	}

	.desktop-icons {
		position: absolute;
		inset: 0;
		z-index: var(--z-desktop-icons);
		pointer-events: none;
	}

	.desktop-icons.no-js {
		display: grid;
		grid-template-rows: repeat(auto-fill, 80px);
		grid-auto-rows: 100px;
		gap: var(--space-4);
		padding: var(--space-4);
		align-content: start;
		pointer-events: auto;
		position: relative;
		inset: auto;
		height: auto;
		overflow-y: auto;
	}

	.desktop-icons :global(.desktop-icon) {
		pointer-events: auto;
	}

	.desktop-icons.no-js :global(.desktop-icon) {
		position: static !important;
	}

	.taskbar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: var(--taskbar-height);
		background: linear-gradient(180deg, #1a4d1a 0%, #0d2e0d 100%);
		border-top: 1px solid var(--color-primary-light);
		display: flex;
		align-items: center;
		padding: 0 var(--space-2);
		gap: var(--space-1);
		z-index: var(--z-taskbar);
	}

	.start-button {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background: var(--win-btn-bg);
		border: 1px solid var(--win-btn-border);
		border-radius: var(--radius-md);
		color: var(--color-text);
		font-family: var(--font-mono);
		font-size: var(--font-size-base);
		font-weight: 600;
		height: 28px;
		flex-shrink: 0;
	}

	.start-button :global(svg) {
		width: 16px;
		height: 16px;
	}

	.start-button:hover {
		background: var(--win-btn-hover);
	}

	.divider {
		width: 1px;
		height: 24px;
		background: var(--color-primary-light);
		opacity: 0.4;
		flex-shrink: 0;
	}

	.window-buttons {
		display: flex;
		flex: 1;
		gap: var(--space-1);
		overflow: hidden;
	}

	.window-button {
		display: flex;
		align-items: center;
		padding: var(--space-2) var(--space-4);
		background: rgba(212, 245, 214, 0.1);
		border: 1px solid rgba(212, 245, 214, 0.15);
		border-radius: var(--radius-md);
		color: var(--color-text-light);
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		height: 26px;
		max-width: 160px;
		flex-shrink: 0;
		overflow: hidden;
	}

	.window-button:hover {
		background: rgba(212, 245, 214, 0.2);
	}

	.window-button.active {
		background: rgba(0, 84, 9, 0.6);
		border-color: var(--color-primary-light);
		box-shadow: var(--shadow-sunken);
	}

	.window-button.minimized {
		opacity: 0.6;
	}

	.window-button-text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.clock-area {
		display: flex;
		align-items: center;
		padding: var(--space-2) var(--space-4);
		border-left: 1px solid rgba(212, 245, 214, 0.2);
		flex-shrink: 0;
	}

	.clock {
		color: var(--color-text-light);
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		letter-spacing: 0.05em;
	}

	.start-popover {
		inset: auto auto calc(var(--taskbar-height) + 2px) var(--space-2);
		margin: 0;
		border: 1px solid var(--win-border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-window);
		background: var(--win-bg);
		display: none;
		overflow: hidden;
		padding: 0;
	}

	.start-popover:popover-open {
		display: flex;
	}

	.start-popover::backdrop {
		background: transparent;
	}

	.start-menu-sidebar {
		width: 28px;
		background-image: var(--bg-gradient);
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding-bottom: var(--space-4);
	}

	.sidebar-text {
		writing-mode: vertical-rl;
		text-orientation: mixed;
		transform: rotate(180deg);
		color: var(--win-titlebar-text);
		font-family: var(--font-mono);
		font-size: var(--font-size-md);
		font-weight: 600;
		letter-spacing: 0.1em;
	}

	.start-menu-items {
		display: flex;
		flex-direction: column;
		min-width: 220px;
		padding: var(--space-2) 0;
	}

	.start-menu-item {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-3) var(--space-5);
		color: var(--color-text);
		text-decoration: none;
		font-family: var(--font-mono);
		font-size: var(--font-size-base);
	}

	.start-menu-item:hover,
	.start-menu-item:active {
		background: var(--color-primary);
		color: var(--color-text-light);
	}

	.start-menu-icon {
		width: 20px;
		height: 20px;
		display: grid;
		place-items: center;
	}

	.start-menu-icon :global(svg) {
		width: 16px;
		height: 16px;
	}

	@media (max-width: 768px) {
		.desktop-shell {
			display: none;
		}
	}
</style>
