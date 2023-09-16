<script lang="ts">
	import { differenceInDays, addDays } from 'date-fns'; // import the differenceInDays function
	import { get } from 'svelte/store';
	import { startDateStore } from './stores';
	import { onMount } from 'svelte';

	let daysSinceStart = get(startDateStore)
		? differenceInDays(new Date(), new Date($startDateStore)) + 1
		: 1; // calculate the difference in days;

	onMount(() => {
		const interval = setInterval(() => {
			daysSinceStart = differenceInDays(new Date(), new Date($startDateStore)) + 1; // recalculate the difference in days
		}, 60000); // refresh once a minute
		return () => clearInterval(interval); // clear the interval on destroy
	});
</script>

<p class="Descriptor">Day</p>

<div class="NumberRow">
	{#each daysSinceStart.toString().split('') as day}
		<p class="Counter">{day}</p>
	{/each}
</div>

<p class="EndDate">
	Finished on
	{addDays(new Date($startDateStore), 76).toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'long'
	})}
</p>

<style>
	@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@600&display=swap');

	.Counter {
		background-color: var(--accent-subtle);
		font-size: 30vw;
		font-family: 'EB Garamond', serif;
		border-radius: var(--border-radius);
		padding: 10%;
	}

	.NumberRow {
		display: flex;
		gap: 1rem;
		justify-content: center;
	}

	.Descriptor {
		font-size: 10vw;
	}

	.EndDate {
		opacity: 80%;
		font-size: max(2vw, 1.6rem);
	}
</style>
