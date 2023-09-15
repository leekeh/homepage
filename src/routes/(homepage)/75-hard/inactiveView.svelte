<script lang="ts">
	import { Button, IconButton } from '@components';
	import { Cog } from '@icons';
	import { startDateStore } from './stores';

	const startTimer = () => {
		startDateStore.set(new Date());
	};

	let isConfiguring = false;
</script>

<div>
	<Button style="width: 12rem" on:click={startTimer}>Let's go!</Button>
	<IconButton on:click={() => (isConfiguring = !isConfiguring)} alt="configure">
		<Cog />
	</IconButton>
</div>

<style>
	div {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
	}
</style>
