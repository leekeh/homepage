<script>
	import { IconButton } from '@components';
	import { Meatball } from '@icons';
	export let data;
	const { title, page } = data;
</script>

<div class="grid">
	<aside>sidebar</aside>
	<div class="mainContainer">
		<div class="buttonContainer">
			<IconButton
				href="/"
				alt="Menu todo"
				style="float: right; margin: -1.5rem -1.5rem 0.5rem 0.5rem"><Meatball /></IconButton
			>
		</div>
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
		display: none;
		border-right: var(--border-width) solid var(--accent);
		min-width: 20rem;
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
		aside {
			display: block;
		}
		.grid {
			grid-template-columns: 1fr 4fr;
		}

		.buttonContainer {
			display: none;
		}

		h1 {
			font-size: 3rem;
		}
	}
</style>
