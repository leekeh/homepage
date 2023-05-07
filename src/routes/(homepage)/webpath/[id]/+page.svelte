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
	<div class="mainContainer">
		{#if !$isDesktop}
			<IconButton
				href="/"
				alt="Menu todo"
				style="float: right; margin: -1.5rem -1.5rem 0.5rem 0.5rem"><Meatball /></IconButton
			>
		{/if}
		<main>
			<h1>{title}</h1>
			<article>
				<svelte:component this={page} />
			</article>
		</main>
	</div>
</div>

<style>
	aside {
		border-right: var(--border-width) solid var(--accent);
	}

	.mainContainer {
		padding: 2rem;
		height: 100%;
		width: 100%;
		overflow: auto;
		box-sizing: border-box;
	}

	h1 {
		font-size: 2rem;
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

		h1 {
			font-size: 3rem;
		}
	}
</style>
