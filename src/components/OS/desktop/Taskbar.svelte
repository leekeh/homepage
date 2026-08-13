<script lang="ts">
	import { resolvePath } from '@utils/resolve';
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

<footer class="taskbar squiggle-border">
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
					class="window-button squiggle-border"
					class:active={isActive}
					href={resolvePath(getRouteForWindow(win.widgetId, win.data))}
					role="menuitem"
					tabindex={hasJsSupport ? (index === clampedMenuIndex ? 0 : -1) : undefined}
					onclick={() => focusWindow(win.id)}
					title={win.title}
					aria-current={isActive ? 'page' : undefined}
				>
					<span class="window-button-text">{win.title}</span>
				</a>
			</li>
		{/each}
	</ul>
	<hr class="divider" />

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
		background-color: var(--color-bg-highlight);
		display: flex;
		align-items: center;
		padding: 0 var(--space-2);
		gap: var(--space-1);
		z-index: var(--z-taskbar);
		user-select: none;
	}

	.divider {
		width: var(--border-width);
		height: 100%;
		background-color: var(--color-fg-primary);
		flex-shrink: 0;
		filter: var(--filter-squiggle);
		border: none;
	}

	.window-buttons {
		display: flex;
		list-style: none;
		flex: 1;
		gap: var(--space-3);
		padding-inline: var(--space-2);
	}

	.window-button {
		display: flex;
		align-items: center;
		padding: var(--space-2) var(--space-4);
		border: none;
		border-radius: var(--radius-md);
		color: var(--color-text-light);
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		max-width: 160px;
		flex-shrink: 0;
		background-color: var(--color-bg-primary);
		--inset-bg: 4px;

		&:hover {
			box-shadow: inset 0 0 0 var(--inset-bg) var(--color-accent);
		}

		&.active {
			background-color: inherit;
			/* use box shadow instead of outline */
			box-shadow: inset 0 0 0 var(--inset-bg) var(--color-bg-primary);
		}
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
		flex-shrink: 0;
	}

	.clock {
		color: var(--color-text-light);
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		letter-spacing: 0.05em;
	}
</style>
