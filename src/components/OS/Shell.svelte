<script lang="ts">
	import { getContext } from 'svelte';
	import { page } from '$app/stores';
	import { WindowManager, WM_CONTEXT_KEY } from './shared/windowManager.svelte';
	import { getWidgetByRoute, loadWidgetComponent } from '../widgets/widgets';

	import Startup from './Startup.svelte';
	import { useJsSupport } from './shared/useJsSupport.svelte';
	import MobileShell from './mobile/MobileShell.svelte';
	import DesktopShell from './desktop/DesktopShell.svelte';

	// Context
	const wm = getContext<WindowManager>(WM_CONTEXT_KEY);
	const hasJsSupport = $derived(useJsSupport());
	const activeWindow = $derived(wm.activeWindow);

	const routeMatch = $derived(getWidgetByRoute($page.url.pathname));
	const fallbackWidgetId = $derived(routeMatch?.widget.id ?? 'about');
</script>

<Startup />

{#snippet mainWindow()}
	{#if activeWindow}
		{@const ActiveComponent = await loadWidgetComponent(activeWindow.widgetId)}
		{#if ActiveComponent}
			<ActiveComponent {...activeWindow.data ?? {}}></ActiveComponent>
		{/if}
	{:else if !hasJsSupport}
		{@const MobileFallbackComponent = await loadWidgetComponent(fallbackWidgetId)}
		{#if MobileFallbackComponent}
			<MobileFallbackComponent />
		{:else}
			<div class="empty-state">
				<p>Open an app from the menu</p>
			</div>
		{/if}
	{:else}
		<div class="empty-state">
			<p>Open an app from the menu</p>
		</div>
	{/if}
{/snippet}

<div class="shell">
	<DesktopShell>
		<!-- todo save main window data somewhere -->
		<!-- <Window
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
			{@render mainWindow?.()}
		</Window> -->
	</DesktopShell>

	<MobileShell>{@render mainWindow?.()}</MobileShell>
</div>

<style>
	.shell {
		position: fixed;
		inset: 0;
		background: url('/bg.png');
		background-size: cover;
		overflow: hidden;
	}

	.empty-state {
		display: grid;
		place-items: center;
		height: 100%;
		color: var(--color-text-muted);
		font-family: var(--font-mono);
		font-size: var(--font-size-md);
	}
</style>
