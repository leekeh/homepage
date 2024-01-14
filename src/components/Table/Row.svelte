<script lang="ts">
	export let href: string = '';
	export let children: any[] = [];
	import Cell from './Cell.svelte';
	import { goto } from '$app/navigation';
	const navigateTo = (href: string) => {
		goto(href);
	};
</script>

{#if href !== ''}
	<tr
		on:click={() => navigateTo(href)}
		on:keypress={() => navigateTo(href)}
		tabindex="0"
		role="link"
		class="link"
	>
		{#each children as cell}
			<Cell>{cell}</Cell>
		{/each}
		<slot />
	</tr>
{:else}
	<tr>
		{#each children as cell}
			<Cell>{cell}</Cell>
		{/each}
		<slot />
	</tr>
{/if}

<style>
	.link {
		cursor: pointer;
		transition: 0.3s ease background;
	}
	.link:hover {
		background-color: var(--accent-subtle);
	}
</style>
