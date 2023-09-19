<script lang="ts">
	export let style: string = '';
	export let type: 'ordered' | 'unordered' | 'unstyled' = 'unordered';
</script>

<svelte:element
	this={type === 'ordered' ? 'ol' : 'ul'}
	class:Unstyled={type === 'unstyled'}
	{style}
>
	<slot />
</svelte:element>

<style>
	ol:not(.Unstyled),
	ul:not(.Unstyled) {
		list-style-position: outside;
		padding-left: 1.5rem;
	}

	ol,
	ul {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.Unstyled {
		list-style: none;
	}

	ol {
		list-style: decimal;
	}
</style>
