<script>
	import { IconButton, Button, Bar } from '@components';
	import { Meatball, Alert } from '@icons';
	import { hasProgrammed } from '../stores';
	import { onMount } from 'svelte';
	export let data;
	const { metadata, next, previous, title } = data;

	import SideBar from './sidebar.svelte';

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
	<SideBar />
	<div class="mainContainer">
		<div class="buttonContainer">
			<IconButton href="/" alt="Menu todo" style="float: right; margin: -1rem -1rem 0.5rem 0.5rem"
				><Meatball /></IconButton
			>
		</div>

		<main id="main">
			<h1>{title}</h1>
			<article>
				<slot />
			</article>
		</main>
		<nav>
			{#if previous}
				<Button href={previous.url}>previous</Button>
			{/if}

			{#if next}
				<Button href={next.url}>next</Button>
			{/if}
		</nav>
	</div>
</div>

<style>
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

	nav {
		padding-top: 0.6rem;
	}

	@media (min-width: 1024px) {
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
