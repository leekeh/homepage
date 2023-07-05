<script>
	import { IconButton, Button, Bar } from '@components';
	import { Meatball, Alert } from '@icons';
	import { hasProgrammed, lastVisited } from '../stores';
	export let data;
	import SideBar from './sidebar.svelte';
	import { progress } from '../stores';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';

	$: ({ metadata, next, previous, title, id } = data);

	let isMounted = false;

	afterNavigate(() => {
		lastVisited.set(id);
	});

	onMount(() => {
		isMounted = true;
	});

	beforeNavigate(() => {
		const copied = { ...$progress };
		copied[id] = { read: true };
		progress.set(copied);
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
		gap: 1.5rem;
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
