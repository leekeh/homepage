<script lang="ts">
	export let style: string = '';
	export let as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
	let data: HTMLElement;
</script>

<svelte:element
	this={as}
	class="Heading"
	id={data?.innerHTML
		.toLowerCase()
		.replace(/\s/g, '-')
		.replace(/[^a-zA-Z0-9-]/g, '')}
	bind:this={data}
	{style}><slot /></svelte:element
>

<style>
	.Heading {
		font-size: 1.7rem;
	}
</style>
