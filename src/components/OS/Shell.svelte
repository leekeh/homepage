<script lang="ts">
	import { page } from '$app/stores';
	import { useWindowManager } from './shared/windowManager.svelte';
	import { getWidgetByRoute, loadWidgetComponent } from '../widgets/widgets';

	import Startup from './Startup.svelte';
	import { useJsSupport } from './shared/useJsSupport.svelte';
	import MobileShell from './mobile/MobileShell.svelte';
	import DesktopShell from './desktop/DesktopShell.svelte';

	const wm = $derived(useWindowManager());
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
		{@const DefaultWidgetForRoute = await loadWidgetComponent(fallbackWidgetId)}
		{#if DefaultWidgetForRoute}
			<DefaultWidgetForRoute />
		{/if}
	{/if}
{/snippet}

<div class="shell">
	<h1 class="sr-only">leekeh</h1>
	<DesktopShell>
		{@render mainWindow?.()}
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
</style>
