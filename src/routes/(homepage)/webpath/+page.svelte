<script lang="ts">
	import { LoadingSpinner } from '@components';
	import { hasProgrammed } from './stores';
	import { onMount } from 'svelte';

	let mounted = false;

	onMount(() => {
		mounted = true;
	});
</script>

<LoadingSpinner isLoading={!mounted}>
	{#if $hasProgrammed === null}
		<h1>leekeh's path to web development</h1>
		<p>
			Hiya! Welcome to my path to web development. In this course I put some basic information that
			I thought would be useful for anyone interested in learning web development.
		</p>
		<p>
			As someone who got into coding frontend a few years ago, I feel like there are a lot of
			resources available online, but it is difficult to discern the most important stuff and not
			get overwhelmed. In this free resource, I put together just the essentials that will enable
			you to indepentently work on projects and keep learning. Each topic will include at least one
			test in which you can put these new ideas to practise. As this tutorial is not supported by
			any sort of funding, you will have to be critical and judge whether you feel ready to move on.
			But that in itself should be a good lesson :)
		</p>

		<p>Before we start, I want to ask you one question:</p>

		<fieldset>
			<legend>Have you programmed before?</legend>

			<label>
				<input bind:group={$hasProgrammed} type="radio" name="hasProgrammed" value={true} /> Yes
			</label>
			<label>
				<input bind:group={$hasProgrammed} type="radio" value={false} /> No
			</label>
		</fieldset>
	{:else}
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
	{/if}
</LoadingSpinner>
