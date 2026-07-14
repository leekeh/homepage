<script lang="ts">
	import { page } from '$app/state';
	import { useWindowManager } from '../shared/windowManager.svelte';
	import { getWidgetByRoute, loadWidgetComponent } from '../../widgets/widgets';
	import { resolve } from '$app/paths';
	import { useJsSupport } from '../shared/useJsSupport.svelte';
	import { useIsPrint } from '../shared/useIsPrint.svelte';
	import { useTime } from '../shared/useTime.svelte';
	import SkipLink from '../shared/SkipLink.svelte';
	import AppDrawer from './AppDrawer.svelte';
	import MobileTabs from './MobileTabs.svelte';
	import MobileNav from './MobileNav.svelte';
	import IconApps from '@icons/IconApps.svelte';

	const wm = $derived(useWindowManager());
	const hasJsSupport = $derived(useJsSupport());
	const time = $derived(useTime());
	const routeMatch = $derived(getWidgetByRoute(page.url.pathname));
	const activeWindow = $derived(wm.activeWindow);

	// 'apps' is a widget like any other. beforeNavigate opens it when navigating to /apps.
	// We detect it here and show the AppDrawer instead of a tabpanel, without showing a tab.
	const viewApps = $derived(activeWindow?.widgetId === 'apps' || !activeWindow);
	const isPrint = $derived(useIsPrint());
</script>

{#if !hasJsSupport || wm.isMobile || isPrint}
	<SkipLink id="mobile-content" />
	<div class="mobile-shell">
		<header class="mobile-header squiggle-border" aria-label="Mobile navigation">
			<!--
				Home / apps button — always an <a> to /apps.
				In JS mode, beforeNavigate intercepts and opens the apps widget window.
				In no-JS mode, the browser navigates normally to /apps.
			-->
			<a
				class="home-btn squiggled"
				href={resolve('/apps')}
				aria-label="Apps"
				title="Apps"
				class:active={viewApps}
				aria-current={viewApps ? 'page' : undefined}
			>
				<IconApps />
			</a>

			<MobileTabs />

			<div class="clock-area">
				<time class="clock" datetime={time}>{time}</time>
			</div>

			<!-- Hamburger: opens compact app list popover (mirrors desktop Start menu) -->
			<MobileNav />
		</header>

		<main class="mobile-content" id="mobile-content">
			{#if !hasJsSupport}
				<!-- No-JS: check URL to decide what to render -->
				{#if routeMatch?.widget.id === 'apps'}
					<AppDrawer />
				{:else}
					{@const DefaultComponent = await loadWidgetComponent(routeMatch?.widget.id ?? 'about')}
					{#if DefaultComponent}
						<DefaultComponent {...routeMatch?.params ?? {}} />
					{/if}
				{/if}
			{:else if viewApps}
				<AppDrawer />
			{:else if activeWindow}
				<div
					role="tabpanel"
					id="mobile-tabpanel"
					tabindex="0"
					aria-labelledby="tab-{activeWindow.id}"
					class="tabpanel"
				>
					{#if activeWindow}
						{@const ActiveComponent = await loadWidgetComponent(activeWindow.widgetId)}
						{#if ActiveComponent}
							<ActiveComponent {...activeWindow.data ?? {}} />
						{/if}
					{/if}
				</div>
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

	/* ── Home / apps button + hamburger shared style ── */
	.home-btn,
	:global(.menu-btn) {
		background-color: transparent;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		text-decoration: none;
		color: inherit;
		min-width: 44px;
		flex-shrink: 0;

		:global(svg) {
			width: 20px;
			height: 20px;
		}

		&:hover {
			box-shadow: inset 0 0 0 4px var(--color-bg-primary);
		}
	}

	.home-btn.active {
		background-color: var(--color-bg-primary);
	}

	/* ── Clock ── */
	.clock-area {
		display: flex;
		align-items: center;
		padding: 0 var(--space-3);
		flex-shrink: 0;
	}

	.clock {
		color: var(--color-text-light);
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		letter-spacing: 0.05em;
	}

	/* ── Content area ── */
	.mobile-content {
		flex: 1;
		overflow: auto;
		min-height: 0;
	}

	/* Tabpanel fills the content area and handles its own scrolling. */
	.tabpanel {
		height: 100%;
		display: flex;
		flex-direction: column;
		overflow: auto;
	}

	@media (max-width: 768px), print {
		.mobile-shell {
			display: flex;
			flex-direction: column;
		}
	}

	@media print {
		.mobile-header {
			display: none !important;
		}

		.tabpanel,
		.mobile-content {
			display: block;
			width: auto;
			height: auto;
			overflow: visible;
		}
	}
</style>
