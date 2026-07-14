<script lang="ts">
	import { page } from '$app/state';
	import { useWindowManager, type WindowState } from '../shared/windowManager.svelte';
	import {
		getWidgetById,
		getWidgetByRoute,
		loadWidgetComponent,
		widgetNavigationData
	} from '../../widgets/widgets';
	import Window from '../window/Window.svelte';
	import MinimalWindow from '../window/MinimalWindow.svelte';
	import DesktopIcon from '../desktop/DesktopIcon.svelte';
	import { useJsSupport } from '../shared/useJsSupport.svelte';
	import Taskbar from './Taskbar.svelte';
	import SkipLink from '../shared/SkipLink.svelte';

	const wm = $derived(useWindowManager());
	const hasJsSupport = $derived(useJsSupport());
	const desktopWidgets = $derived.by(() => {
		const withPositions = widgetNavigationData
			.filter((widget) => widget.navigable !== false)
			.map((widget, index) => ({
				widget,
				index,
				position: wm.getIconPosition(widget.id, index)
			}));
		// Sort by position to ensure tab order is consistent with visual order.
		return withPositions.toSorted(
			(a, b) => a.position.y - b.position.y || a.position.x - b.position.x || a.index - b.index
		);
	});

	const routeMatch = $derived(getWidgetByRoute(page.url.pathname));
	const fallbackWidgetId = $derived(routeMatch?.widget.id ?? 'about');
</script>

{#if !hasJsSupport || !wm.isMobile}
	<SkipLink id="desktop-content" />

	<div class="desktop-shell">
		<nav class="desktop-icons" class:no-js={!hasJsSupport} aria-label="Desktop links">
			<ul style="display: contents;">
				{#each desktopWidgets as item (item.widget.id)}
					<li>
						<DesktopIcon
							id={item.widget.id}
							label={item.widget.title}
							icon={item.widget.icon}
							href={item.widget.route}
							index={item.index}
						/>
					</li>
				{/each}
			</ul>
		</nav>

		{#snippet renderWindow(win: WindowState)}
			{@const WindowComponent = win.minimal ? MinimalWindow : Window}
			{@const def = getWidgetById(win.widgetId)}
			<WindowComponent
				{...win}
				defaultMaximized={def?.defaultMaximized}
				resizable={def?.resizable ?? true}
			>
				{@const WidgetComponent = await loadWidgetComponent(win.widgetId)}
				{#if WidgetComponent}
					<WidgetComponent {...win.data ?? {}} />
				{/if}
			</WindowComponent>
		{/snippet}

		<main id="desktop-content">
			{#if !hasJsSupport}
				{@const def = getWidgetById(fallbackWidgetId)}
				{#if def}
					{@render renderWindow({
						id: fallbackWidgetId,
						widgetId: fallbackWidgetId,
						title: routeMatch?.widget.title ?? def.title,
						x: def.defaultX ?? 80,
						y: def.defaultY ?? 60,
						width: def.defaultWidth,
						height: def.defaultHeight,
						zIndex: 10,
						minimized: false,
						maximized: def.defaultMaximized ?? false,
						minimal: def.minimal,
						data: routeMatch?.params
					})}
				{/if}
			{:else}
				{#each wm.windows as win (win.id)}
					{#if !win.minimized}
						{@render renderWindow(win)}
					{/if}
				{/each}
			{/if}
		</main>
		<Taskbar />
	</div>
{/if}

<style>
	.desktop-shell {
		position: absolute;
		inset: 0;
		background: url('/bg.png');
		background-size: cover;
	}

	.desktop-icons {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.desktop-icons.no-js {
		display: flex;
		flex-direction: column;
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

	@media (max-width: 768px), print {
		.desktop-shell {
			display: none;
		}
	}
</style>
