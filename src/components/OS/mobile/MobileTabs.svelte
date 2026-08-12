<script lang="ts">
	import { page } from '$app/state';
	import { tick } from 'svelte';
	import { resolve } from '$app/paths';
	import { useWindowManager } from '../shared/windowManager.svelte';
	import { getWidgetByRoute } from '../../widgets/widgets';
	import { useJsSupport } from '../shared/useJsSupport.svelte';
	import { useRovingTabindex } from '../shared/useRovingTabindex.svelte';
	import IconClose from '@icons/IconClose.svelte';

	const wm = $derived(useWindowManager());
	const hasJsSupport = $derived(useJsSupport());
	const routeMatch = $derived(getWidgetByRoute(page.url.pathname));
	const activeWindow = $derived(wm.activeWindow);

	// All open windows except the apps widget (which has no visible tab)
	const visibleTabs = $derived(wm.windows.filter((w) => w.widgetId !== 'apps'));

	// Roving tabindex state — tracks keyboard focus (not selection)
	let tabFocusIndex = $state(0);
	const clampedFocusIndex = $derived(
		visibleTabs.length > 0 ? Math.min(tabFocusIndex, visibleTabs.length - 1) : 0
	);

	// WAI-ARIA tabs-manual pattern: arrow keys move focus, Enter/Space activates
	const tablistNav = useRovingTabindex({
		selector: '[role="tab"]',
		orientation: 'horizontal',
		activeIndex: () => clampedFocusIndex,
		setActiveIndex: (i) => {
			tabFocusIndex = i;
		},
		onKeydown: (event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				const win = visibleTabs[clampedFocusIndex];
				if (win) selectTab(win.id);
			}
			if (event.key === 'Delete') {
				event.preventDefault();
				const win = visibleTabs[clampedFocusIndex];
				if (win) closeTab(win.id);
			}
		}
	});

	function selectTab(id: string) {
		const idx = visibleTabs.findIndex((w) => w.id === id);
		if (idx !== -1) tabFocusIndex = idx;
		const win = wm.windows.find((w) => w.id === id);
		if (win?.minimized) win.minimized = false;
		wm.focus(id);
	}

	// Scroll the active tab into view whenever the active window changes
	$effect(() => {
		if (!activeWindow) return;
		const tabEl = document.getElementById(`tab-${activeWindow.id}`);
		tabEl?.closest('.tab-item')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
	});

	async function closeTab(id: string) {
		const idx = visibleTabs.findIndex((w) => w.id === id);
		wm.close(id);
		await tick();
		const tabs = document.querySelectorAll<HTMLElement>('[role="tab"]');
		if (tabs.length > 0) {
			const nextIdx = Math.min(idx, tabs.length - 1);
			tabFocusIndex = nextIdx;
			tabs[nextIdx]?.focus();
		}
	}
</script>

<!--
	WAI-ARIA tabs-manual pattern
	https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-manual/
	- role="tablist" owns the tab buttons
	- Each tab: role="tab", aria-selected, aria-controls, roving tabindex
	- Activation: Enter/Space (manual); Delete closes the focused tab
	- 'apps' widget is excluded — it has no visible tab
-->
<div
	class="mobile-tabs"
	role="tablist"
	aria-label="Open applications"
	{@attach tablistNav.attachment}
>
	{#if hasJsSupport}
		{#each visibleTabs as win, i (win.id)}
			{@const isSelected = activeWindow?.id === win.id}
			<div class="tab-item squiggle-border" class:active={isSelected}>
				<button
					type="button"
					role="tab"
					id="tab-{win.id}"
					class="mobile-tab"
					aria-selected={isSelected}
					aria-controls="mobile-tabpanel"
					tabindex={i === clampedFocusIndex ? 0 : -1}
					onclick={() => selectTab(win.id)}
				>
					<span class="tab-label">{win.title}</span>
				</button>
				<button
					type="button"
					class="close-tab-btn"
					aria-label="Close {win.title}"
					tabindex="-1"
					onclick={() => closeTab(win.id)}
				>
					<IconClose />
				</button>
			</div>
		{/each}
	{:else if routeMatch && routeMatch.widget.id !== 'apps'}
		<!-- No-JS: single static tab for the current widget; X goes to /apps -->
		<div class="tab-item squiggle-border active">
			<span class="mobile-tab">
				<span class="tab-label">{routeMatch.widget.title}</span>
			</span>
			<a class="close-tab-btn" href={resolve('/apps')} aria-label="Close {routeMatch.widget.title}">
				<IconClose />
			</a>
		</div>
	{/if}
</div>

<style>
	/* ── Tablist scroll container ── */
	.mobile-tabs {
		display: flex;
		align-items: flex-end;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-2) 0;
		overflow-x: auto;
		scrollbar-width: none;
		flex: 1;
	}

	.mobile-tabs::-webkit-scrollbar {
		display: none;
	}

	/* ── Tab item: visual tab shape shared by label + close button ── */
	.tab-item {
		display: flex;
		align-items: stretch;
		flex-shrink: 0;
		border-radius: var(--radius-lg) var(--radius-lg) 0 0;
		border: var(--border-width) solid var(--color-fg-primary);
		border-bottom: none;

		&.active {
			background: var(--color-bg-primary);
		}

		&:not(.active):hover {
			box-shadow: inset 0 0 0 4px var(--color-bg-primary);
		}
	}

	/* ── Tab label button / span ── */
	.mobile-tab {
		display: flex;
		align-items: center;
		padding: var(--space-2) var(--space-2) var(--space-2) var(--space-4);
		background: transparent;
		border: none;
		color: var(--color-text-light);
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		cursor: pointer;
		max-width: 130px;
	}

	.tab-label {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* ── Close (×) button / link ──
	   min-width/height ensure ≥24×24 touch target */
	.close-tab-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		text-decoration: none;
		color: var(--color-text-light);
		cursor: pointer;
		flex-shrink: 0;
		min-width: 24px;
		min-height: 24px;
		padding: 0 var(--space-3);
		border-radius: var(--radius-round);
		filter: var(--filter-squiggle);

		:global(svg) {
			width: 10px;
			height: 10px;
		}

		--box-shadow-color: transparent;
		box-shadow: inset 0 0 0 4px var(--box-shadow-color);

		&:hover {
			--box-shadow-color: #ff8989;
		}
	}
</style>
