<script>
	import { IconButton, Button, Bar } from '@components';
	import { Meatball, Alert } from '@icons';
	import { hasProgrammed } from '../stores';
	import { onMount } from 'svelte';
	export let data;
	const { metadata, page, next, previous } = data;

	let isMounted = false;

	onMount(() => {
		isMounted = true;
	});
</script>

{#if $hasProgrammed === null && isMounted}
	<Bar>
		<h2><Alert /> Missing setup</h2>
		<p>
			We would like to know whether you have programmed before. This will make sure the course is
			better tailored to your needs.
		</p>
		<p>Do you have any prior coding experience?</p>
		<span>
			<Button onClick={() => hasProgrammed.set('true')}>Yes</Button>
			<Button onClick={() => hasProgrammed.set('false')}>No</Button></span
		>
	</Bar>
{/if}

<div class="grid">
	<aside>sidebar</aside>
	<div class="mainContainer">
		<div class="buttonContainer">
			<IconButton href="/" alt="Menu todo" style="float: right; margin: -1rem -1rem 0.5rem 0.5rem"
				><Meatball /></IconButton
			>
		</div>

		<main id="main">
			<h1>{metadata.title}</h1>
			<article>
				<svelte:component this={page} />
			</article>
			<!-- TODO figure out why these don't update -->
		</main>
		<nav>
			{#if previous}
				<Button href={previous}>previous</Button>
			{/if}

			{#if next}
				<Button href={next}>next</Button>
			{/if}
		</nav>
	</div>
</div>

<style>
	aside {
		display: none;
		border-right: var(--border-width) solid var(--accent);
		min-width: 20rem;
	}

	.mainContainer {
		padding: 1rem;
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

	article,
	main {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		align-items: start;
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

		.mainContainer {
			padding: 2rem;
		}
	}
</style>
