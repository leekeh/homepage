<script lang="ts">
	import { Button } from '@components';
	import { onMount } from 'svelte';
	import { startDateStore } from './stores';
	import Counter from './counter.svelte';

	const startTimer = () => {
		startDateStore.set(new Date());
	};
	const stopTimer = () => {
		startDateStore.set(null);
	};
	let isMounted = false;
	onMount(() => {
		isMounted = true;
	});
</script>

<Counter />

<div>
	<Button on:click={startTimer}>Restart</Button>
	<Button on:click={stopTimer}>Stop</Button>
</div>

<style>
	div {
		width: 100%;
		display: flex;
		flex-direction: row;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}
</style>
