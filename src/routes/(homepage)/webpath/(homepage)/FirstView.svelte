<script lang="ts">
	import { Button, RadioGroup } from '@components';
	import { hasProgrammed } from '../stores';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import pageMap from '../(articles)/pageMap';
	let inputValue: string;

	const confirmChoice = (e: Event) => {
		e.preventDefault();
		if (inputValue !== undefined) {
			hasProgrammed.set(inputValue);
			goto(`${$page.url.pathname}/${pageMap[0].pages[0].url}`);
		} else {
			alert('Please pick an option before starting');
		}
	};
</script>

<h1>leekeh's path to web development</h1>

<p>
	Welcome to my web development course. I've put together the essential information you need to be
	ready to work on independent projects and kick-start your path to becoming a pro.
</p>
<p>
	We will cover HTML, CSS, JavaScript (including basic TypeScript), and other key topics. Some
	common pitfalls are also tackled, to ensure that you can write clean code and create accessible
	experiences from the get-go.
</p>
<p>
	Each topic includes some questions for hands-on practice. Since this is a free and unfunded
	tutorial we cannot afford personal mentors, so use your judgement to decide when you're ready to
	move on.
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

<style>
	h1 {
		font-size: 2rem;
		text-align: center;
	}

	p {
		max-width: 60rem;
	}

	form {
		display: flex;
		flex-direction: column;
		align-items: start;
		gap: 1rem;
	}
</style>
