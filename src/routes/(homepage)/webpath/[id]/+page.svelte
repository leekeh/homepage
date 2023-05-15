<script>
	import { IconButton, Button, Bar } from '@components';
	import { Meatball, Alert } from '@icons';
	import { hasProgrammed } from '../stores';
	import { onMount } from 'svelte';
	export let data;
	const { title, page, next, previous } = data;

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
			<IconButton
				href="/"
				alt="Menu todo"
				style="float: right; margin: -1.5rem -1.5rem 0.5rem 0.5rem"><Meatball /></IconButton
			>
		</div>

		<main id="main">
			<h1>{title}</h1>
			<article>
				<svelte:component this={page} />
			</article>
			<!-- TODO figure out why these don't update -->

			{#if previous}
				<Button href={previous}>previous</Button>
			{/if}

			{#if next}
				<Button href={next}>next</Button>
			{/if}
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

	span {
		display: inline-flex;
		gap: 1rem;
		flex-wrap: true;
	}

	p {
		max-width: min(40rem, 85%);
		text-align: center;
	}

	h2 {
		font-weight: bold;
		font-size: 1.8rem;
		display: inline-flex;
		gap: 0.6rem;
		align-items: center;
		line-height: 0.1px;
	}

	article,
	main {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		align-items: start;
	}
</style>
