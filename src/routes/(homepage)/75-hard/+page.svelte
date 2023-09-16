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

<Card as="section" style="width: max(300px, 80vw); padding: 0">
	<Heading as="h2" style="font-size: max(2rem, 5vw); padding-top: 1rem">75 hard challenge</Heading>
	<div class="Divider" />
	<LoadingSpinner isLoading={!isMounted}>
		<div class="FlexContainer">
			{#if !hasStarted}
				<InactiveView />
			{:else}
				<ActiveView />
			{/if}
		</div>
	</LoadingSpinner>
</Card>

<style>
	.FlexContainer {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
		gap: 5vw;
		padding: 1rem;
	}

	.Divider {
		border-top: var(--border-width) solid var(--accent);
		width: 100%;
	}
</style>
