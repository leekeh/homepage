<script lang="ts">
	import { Button } from '@components';
	import { Cog, Floppy } from '@icons';
	import { startDateStore } from './stores';
	import Rules from './rules.svelte';

	const startTimer = () => {
		startDateStore.set(new Date());
	};

	let isConfiguring = false;
</script>

<Rules {isConfiguring} />

{#if !isConfiguring}
	<Button style="width: 12rem" on:click={startTimer}>Let's go!</Button>
{/if}
<Button on:click={() => (isConfiguring = !isConfiguring)}>
	<div slot="icon">
		{#if isConfiguring}
			<Floppy />
		{:else}
			<Cog />
		{/if}
	</div>
	{isConfiguring ? 'save' : 'configure'}
</Button>

<style>
	.ButtonRow {
		display: flex;
		flex-direction: row;
		gap: 2vw;
	}
</style>
