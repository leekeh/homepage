<script lang="ts">
	export let style: string = '';
	export let as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' = 'h1';
</script>

{#if as === 'h1'}
	<h1 {style}>
		<slot />
	</h1>
{:else if as === 'h2'}
	<h2 {style}>
		<slot />
	</h2>
{:else if as === 'h3'}
	<h3 {style}>
		<slot />
	</h3>
{:else if as === 'h4'}
	<h4 {style}>
		<slot />
	</h4>
{:else if as === 'h5'}
	<h5 {style}>
		<slot />
	</h5>
{:else if as === 'h6'}
	<h6 {style}>
		<slot />
	</h6>
{/if}

<style>
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		font-size: 1.7rem;
	}
</style>
