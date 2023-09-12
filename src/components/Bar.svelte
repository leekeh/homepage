<script lang="ts">
	export let style: string = '';
</script>

<header {style}><slot /></header>

<style>
	header {
		background-color: var(--accent-subtle);
		border-bottom: var(--border-width) solid var(--accent);
		padding: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}
</style>
