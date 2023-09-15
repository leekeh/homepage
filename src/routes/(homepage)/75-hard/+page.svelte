<script lang="ts">
	import { onMount } from 'svelte';

	import { Card, Heading, LoadingSpinner } from '@components';
	import { startDateStore } from './stores';
	import InactiveView from './inactiveView.svelte';
	import ActiveView from './activeView.svelte';

	$: hasStarted = !!$startDateStore;

	let isMounted = false;
	onMount(() => {
		isMounted = true;
	});
</script>

<Card as="section" style="width: 80vw">
	<Heading as="h2">75 hard challenge</Heading>
	<LoadingSpinner isLoading={!isMounted}>
		<div>
			{#if !hasStarted}
				<InactiveView />
			{:else}
				<ActiveView />
			{/if}
		</div>
	</LoadingSpinner>
</Card>

<style>
	div {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
		gap: 5vw;
	}
</style>
