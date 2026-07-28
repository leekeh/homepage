<script lang="ts">
	import TreatGrid from './TreatGrid.svelte';
</script>

<div class="treats">
	<p>Tasty treats from random saturdays</p>
	<TreatGrid />
</div>

<style>
	.treats {
		padding: var(--space-4);
		font-family: var(--font-sans);
	}

	p {
		margin: 0 0 var(--space-3);
		font-size: var(--font-size-m);
		color: var(--color-fg-subtle);
	}
</style>
