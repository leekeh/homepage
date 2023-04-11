<script>
	import { IconButton } from '@components';
	import { isDesktop } from '@stores';
	import { Meatball } from '@icons';
	export let data;
	const { title, page } = data;
</script>

<div class="grid">
	{#if $isDesktop}
		<aside>sidebar</aside>
	{:else}
		<IconButton href="/" alt="tem[" style="position: absolute; right: 4px; top: 4px;"
			><Meatball /></IconButton
		>
	{/if}

	<div>
		<h1>{title}</h1>
		<main>
			<svelte:component this={page} />
		</main>
	</div>
</div>

<style>
	aside {
		border-right: 2px solid var(--accent);
	}
	.grid {
		display: grid;
		grid-template-columns: 1fr 4fr;
		align-items: stretch;
		height: 100%;
	}
</style>
