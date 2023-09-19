<script lang="ts">
	import { List, InputText, Button } from '@components';
	import { onMount } from 'svelte';
	import { ruleStore } from './stores';
	import IconButton from '@components/IconButton.svelte';
	import Cross from '@icons/Cross.svelte';

	onMount(() => {
		if (rules === null) {
			ruleStore.set([
				'Follow a diet',
				'2 x 45 workouts',
				'Drink a gallon of water',
				'Read 10 pages of nonfiction',
				'Take a progress picture'
			]);
		}
	});

	const removeItem = (index: number) => {
		ruleStore.set(rules.toSpliced(index, 1));
	};

	const addItem = () => {
		ruleStore.set([...rules, 'New rule']);
	};
	export let isConfiguring: boolean = false;

	$: rules = $ruleStore;
</script>

{#if isConfiguring}
	{#if rules !== null}
		<List type="unstyled" style="gap: 2vw; font-size: 1.5rem; width: 100%">
			{#each rules as { }, i}
				<li class="InputRow">
					<InputText
						bind:value={rules[i]}
						style="flex-grow: 1; flex-shrink: 1; max-width: calc(100% - 4rem);"
					/>
					<IconButton on:click={() => removeItem(i)} alt={`Remove ${rules[i]}`}
						><Cross /></IconButton
					>
				</li>
			{/each}
		</List>
		<Button on:click={addItem}>Add new rule</Button>
	{/if}
{:else if rules !== null}
	<List type="unstyled" style="gap: 2vw; font-size: 2rem">
		{#each rules as rule}
			<li>{rule}</li>
		{/each}
	</List>
{/if}

<style>
	.InputRow {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}
</style>
