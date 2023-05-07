<script lang="ts">
	let firstTime: boolean;
	//todo get this from context whether preferences are stored or not

	import { onMount } from 'svelte';

	onMount(() => {
		firstTime = !(
			localStorage.getItem('tutorialViewed') ?? localStorage.setItem('tutorialViewed', 'true')
		);
	});
</script>

{#if firstTime}
	<p>Welcome to coming here for the first time thx</p>
	Have you programmed before?<br />
{:else if firstTime === false}
	<main>
		<p>Some friendly landing page text.</p>
		<nav>
			<button>introduction</button><button>HTML</button> <button>CSS</button> <button>jss</button>
			<button>other</button><button>afterword</button>
			<br />
			<button>Continue where you left off</button>
		</nav>
		<br />

		<!-- maybe an input element? -->

		<!-- TODO get a star if you also do all optional items. -->
		<label for="progress">Progress</label>
		<progress id="progress" value="32" max="100" />
		<br />
	</main>
{:else}
	<p>Loading</p>
{/if}
