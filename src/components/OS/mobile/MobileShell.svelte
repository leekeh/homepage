<script lang="ts">
	import { type Snippet } from 'svelte';
	import { page } from '$app/state';
	import { useWindowManager } from '../shared/windowManager.svelte';
	import { getWidgetByRoute, getRouteForWindow, widgetNavigationData } from '../../widgets/widgets';
	import { resolve } from '$app/paths';
	import AppDrawer from './AppDrawer.svelte';
	import MobileNav from './MobileNav.svelte';
	import { useJsSupport } from '../shared/useJsSupport.svelte';
	import SkipLink from '../shared/SkipLink.svelte';

	type Props = { children: Snippet };

	let { children }: Props = $props();

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
		<header class="mobile-header" aria-label="Mobile navigation">
			<AppDrawer />

			<nav class="mobile-tabs" aria-label="Applications">
				{#each widgetNavigationData as widget (widget.id)}
					<a
						class="mobile-tab"
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
			{@render children?.()}
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
		background: linear-gradient(180deg, #1a4d1a 0%, #0d2e0d 100%);
		border-bottom: 1px solid var(--color-primary-light);
		z-index: var(--z-taskbar);
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
		color: var(--color-text-light);
		text-decoration: none;
		padding: var(--space-2) var(--space-4);
		border-radius: var(--radius-lg) var(--radius-lg) 0 0;
		border: 1px solid rgba(212, 245, 214, 0.12);
		border-bottom: none;
		background: rgba(212, 245, 214, 0.08);
		white-space: nowrap;
		font-size: var(--font-size-sm);
		font-family: var(--font-mono);
	}

	.mobile-tab.active {
		background: var(--win-bg);
		color: var(--color-text);
		border-color: var(--win-border);
	}

	.mobile-content {
		flex: 1;
		overflow: auto;
		background: var(--win-bg);
		min-height: 0;
	}

	@media (max-width: 768px) {
		.mobile-shell {
			display: flex;
			flex-direction: column;
		}
	}
</style>
