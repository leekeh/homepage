<script lang="ts">
	export let as: 'td' | 'th' = 'td';
	export let style: string = '';
</script>

<svelte:element this={as} {style}><slot /></svelte:element>

<style>
	td,
	th {
		padding: 1rem;
		background: inherit;
		text-align: left;
		color: inherit;
		border-top: var(--border-width) solid var(--accent);
		position: relative;
	}

	th {
		font-weight: 600;
		white-space: nowrap;
	}
</style>
