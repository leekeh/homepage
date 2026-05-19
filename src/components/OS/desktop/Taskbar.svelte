<script lang="ts">
	import { resolve } from '$app/paths';
	import { getRouteForWindow } from '@components/widgets/widgets';
	import { useWindowManager } from '../shared/windowManager.svelte';
	import { useTime } from '../shared/useTime.svelte';
	import { useRovingTabindex } from '../shared/useRovingTabindex.svelte';
	import StartMenu from './StartMenu.svelte';
	import { useJsSupport } from '../shared/useJsSupport.svelte';

	// Context
	const wm = $derived(useWindowManager());
	const time = $derived(useTime());
	const hasJsSupport = $derived(useJsSupport());

	// State
	let menuActiveIndex = $state(0);
	// Clamp to valid range so there's always a tabindex=0 item when windows exist
	const clampedMenuIndex = $derived(
		wm.windows.length > 0 ? Math.min(menuActiveIndex, wm.windows.length - 1) : 0
	);

	const menubarNav = useRovingTabindex({
		selector: '[role="menuitem"]',
		orientation: 'horizontal',
		activeIndex: () => clampedMenuIndex,
		setActiveIndex: (i) => {
			menuActiveIndex = i;
		}
	});

	// Interactions
	function focusWindow(id: string) {
		const win = wm.windows.find((w) => w.id === id);
		if (win?.minimized) win.minimized = false;
		wm.focus(id);
	}
</script>

<footer class="taskbar">
	<StartMenu />
	<hr class="divider" />

	<ul
		class="window-buttons"
		role="menubar"
		{@attach menubarNav.attachment}
		aria-label="Open windows"
	>
		{#each wm.windows as win, index (win.id)}
			{@const isActive = wm.activeWindow?.id === win.id && !win.minimized}
			<li role="none">
				<a
					class="window-button"
					class:active={isActive}
					class:minimized={win.minimized}
					href={resolve(getRouteForWindow(win.widgetId, win.data))}
					role="menuitem"
					tabindex={hasJsSupport ? (index === clampedMenuIndex ? 0 : -1) : undefined}
					onclick={() => focusWindow(win.id)}
					title={win.title}
				>
					<span class="window-button-text">{win.title}</span>
				</a>
			</li>
		{/each}
	</ul>

	<div class="clock-area">
		<time class="clock" datetime={time}>{time}</time>
	</div>
</footer>

<style>
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

	.divider {
		width: 1px;
		height: 24px;
		background: var(--color-primary-light);
		opacity: 0.4;
		flex-shrink: 0;
	}

	.window-buttons {
		display: flex;
		list-style: none;
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

	.window-button:focus-visible {
		outline: 2px solid var(--color-primary-light);
		outline-offset: -2px;
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
</style>
