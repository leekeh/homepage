<script lang="ts">
	import { LoadingSpinner, Link } from '@components';
	import { hasProgrammed, lastVisited, progress } from '../stores';
	import { onMount } from 'svelte';
	import pageMap from '../(articles)/pageMap';

	import Heading from '@components/Heading.svelte';
	import MenuButton from './menubuttons/MenuButton.svelte';
	let mounted = false;

	import FirstView from './FirstView.svelte';
	onMount(() => {
		mounted = true;
	});
</script>

<LoadingSpinner isLoading={!mounted}>
	<main>
		{#if $hasProgrammed === null}
			<FirstView />
		{:else}
			<Heading as="h1">Dashboard</Heading>

			{#if $lastVisited !== null}
				<Link href={`/webpath/${$lastVisited}`}>Continue where you left off</Link>
			{/if}

			<Heading as="h2">
				{#if $lastVisited !== null}
					or
				{/if}jump to:</Heading
			>
			<nav>
				<ul>
					<MenuButton href="html" type="HTML" />
					<MenuButton href="css" type="CSS" />
					<MenuButton href="js" type="JS" />
					<MenuButton
						href={pageMap.find((item) => item.sectionName === 'Other things')?.pages[0].url || ''}
						type="other"
					/>
				</ul>
			</nav>
			<br />

			<!-- TODO get a star if you also do all optional items. -->
			<label for="progress">Progress</label>
			<progress id="progress" value="32" max="100" />
			<br />
		{/if}
	</main>
</LoadingSpinner>

<style>
	main {
		padding: min(2%, 25px);
	}

	main {
		display: flex;
		flex-direction: column;
		align-items: start;
		gap: 1rem;
	}

	ul {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	@media (min-width: 768px) {
		ul {
			grid-template-columns: repeat(4, 1fr);
		}
	}
</style>
