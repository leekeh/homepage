<script lang="ts">
	import { LoadingSpinner, Button, RadioGroup } from '@components';
	import { hasProgrammed } from './stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import pageMap from './(articles)/pageMap';

	let mounted = false;
	let inputValue: string;

	onMount(() => {
		mounted = true;
	});

	const confirmChoice = (e: Event) => {
		e.preventDefault();
		if (inputValue !== undefined) {
			hasProgrammed.set(inputValue);
			mounted = false;
			goto(`${$page.url.pathname}/${pageMap[0].pages[0]}`);
		} else {
			alert('Please pick an option before starting');
		}
	};
</script>

<LoadingSpinner isLoading={!mounted}>
	<main>
		{#if $hasProgrammed === null}
			<h1>leekeh's path to web development</h1>

			<p>
				Welcome to my web development course. I've put together the essential information you need
				to be ready to work on independent projects and kick-start your path to becoming a pro.
			</p>
			<p>
				We will cover HTML, CSS, JavaScript (including basic TypeScript), and other key topics. Some
				common pitfalls are also tackled, to ensure that you can write clean code and create
				accessible experiences from the get-go.
			</p>
			<p>
				Each topic includes some questions for hands-on practice. Since this is a free and unfunded
				tutorial we cannot afford personal mentors, so use your judgement to decide when you're
				ready to move on.
			</p>

			<!-- TODO: add an expected duration -->

			<p>Before we start, I want to ask you one question:</p>

			<form on:submit={confirmChoice}>
				<RadioGroup
					label="Have you programmed before?"
					hint="This will affect how much time will be spent explaining basic programming principles"
					options={[
						{ label: 'Yes', value: true },
						{ label: 'No', value: false }
					]}
					bind:value={inputValue}
				/>
				<Button>Start</Button>
			</form>
		{:else}
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
		{/if}
	</main>
</LoadingSpinner>

<style>
	h1 {
		font-size: 2rem;
		text-align: center;
	}

	p {
		max-width: 60rem;
	}

	main {
		padding: min(2%, 25px);
	}

	main,
	form {
		display: flex;
		flex-direction: column;
		align-items: start;
		gap: 1rem;
	}
</style>
