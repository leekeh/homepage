<script lang="ts">
	import { page } from '$app/state';
	import { useWindowManager } from '../shared/windowManager.svelte';
	import {
		getWidgetByRoute,
		getRouteForWindow,
		loadWidgetComponent,
		widgetNavigationData
	} from '../../widgets/widgets';
	import { resolve } from '$app/paths';
	import AppDrawer from './AppDrawer.svelte';
	import MobileNav from './MobileNav.svelte';
	import { useJsSupport } from '../shared/useJsSupport.svelte';
	import SkipLink from '../shared/SkipLink.svelte';

	const wm = $derived(useWindowManager());
	const hasJsSupport = $derived(useJsSupport());

	// Find active tab - FIXME this seems too heavy here
	const activeWindow = $derived(wm.activeWindow);
	const routeMatch = $derived(getWidgetByRoute(page.url.pathname));

	const activeTabRoute = $derived.by(() => {
		if (activeWindow) {
			const route = getRouteForWindow(activeWindow.widgetId, activeWindow.data);
			return route.startsWith('/blog/') ? '/blog' : route;
		}
		const matched = routeMatch?.widget.route ?? '/';
		if (matched.includes('[')) {
			return matched.split('[')[0].replace(/\/$/, '') || '/';
		}
		return matched;
	});
</script>

{#if !hasJsSupport || wm.isMobile}
	<SkipLink id="mobile-content" />
	<div class="mobile-shell">
		<header class="mobile-header squiggle-border" aria-label="Mobile navigation">
			<AppDrawer />

			<nav class="mobile-tabs" aria-label="Applications">
				{#each widgetNavigationData as widget (widget.id)}
					<a
						class="mobile-tab squiggle-border"
						class:active={activeTabRoute === widget.route}
						href={resolve(widget.route)}
					>
						{widget.title}
					</a>
				{/each}
			</nav>

			<MobileNav />
		</header>

		<main class="mobile-content" id="mobile-content">
			{#if activeWindow}
				{@const ActiveComponent = await loadWidgetComponent(activeWindow.widgetId)}
				{#if ActiveComponent}
					<ActiveComponent {...activeWindow.data ?? {}} />
				{/if}
			{:else if !hasJsSupport}
				{@const DefaultComponent = await loadWidgetComponent(routeMatch?.widget.id ?? 'about')}
				{#if DefaultComponent}
					<DefaultComponent />
				{/if}
			{/if}
		</main>
	</div>
{/if}

<style>
	.mobile-shell {
		position: absolute;
		inset: 0;
		display: none;
		background: var(--desktop-bg);
	}

	.mobile-header {
		display: flex;
		align-items: stretch;
		background: var(--color-bg-highlight);
		z-index: var(--z-taskbar);
		height: var(--taskbar-height);
		flex-shrink: 0;
	}

	.mobile-tabs {
		display: flex;
		align-items: stretch;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-2) 0;
		overflow-x: auto;
		scrollbar-width: none;
		flex: 1;
	}

	.mobile-tabs::-webkit-scrollbar {
		display: none;
	}

	.mobile-tab {
		text-decoration: none;
		padding: var(--space-2) var(--space-4);
		border-radius: var(--radius-lg) var(--radius-lg) 0 0;
		border: var(--border-width) solid var(--color-fg-primary);
		border-bottom: none;
		white-space: nowrap;
		font-size: var(--font-size-sm);
		font-family: var(--font-mono);

		&.active {
			background: var(--color-bg-primary);
		}

		&:hover {
			box-shadow: inset 0 0 0 4px var(--color-bg-primary);
		}
	}

	.mobile-content {
		flex: 1;
		overflow: auto;
		min-height: 0;
	}

	@media (max-width: 768px) {
		.mobile-shell {
			display: flex;
			flex-direction: column;
		}
	}
</style>
