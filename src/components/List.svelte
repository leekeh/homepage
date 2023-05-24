<script lang="ts">
	export let style: string = '';
	export let type: 'ordered' | 'unordered' = 'unordered';
</script>

{#if type === 'ordered'}
	<ol {style}>
		<slot />
	</ol>
{:else}
	<ul {style}>
		<slot />
	</ul>
{/if}

<style>
	ol,
	ul {
		list-style-position: outside;
		padding-left: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	ol {
		list-style: decimal;
	}
</style>
