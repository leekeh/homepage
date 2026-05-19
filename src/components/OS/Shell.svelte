<script lang="ts">
	import Startup from './Startup.svelte';
	import MobileShell from './mobile/MobileShell.svelte';
	import DesktopShell from './desktop/DesktopShell.svelte';
</script>

<Startup />

<div class="shell">
	<h1 class="sr-only">leekeh</h1>
	<DesktopShell />
	<MobileShell />
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
