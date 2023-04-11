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
	{/if}

	<div>
		{#if !$isDesktop}
			<IconButton href="/" alt="tem[" style="float: right; margin:0.5rem"><Meatball /></IconButton>
		{/if}

		As much mud in the streets as if the waters had but newly retired from the face of the earth,
		and it would not be wonderful to meet a Megalosaurus, forty feet long or so, waddling like an
		elephantine lizard up Holborn Hill.
		<h1>{title}</h1>
		<main>
			<svelte:component this={page} />
		</main>
	</div>
</div>

<style>
	aside {
		border-right: var(--border-width) solid var(--accent);
	}
	.grid {
		display: grid;
		grid-template-columns: 1fr;
		align-items: stretch;
		height: 100%;
	}

	@media (min-width: 1024px) {
		.grid {
			grid-template-columns: 1fr 4fr;
		}
	}
</style>
