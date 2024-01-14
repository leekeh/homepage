<script lang="ts">
	export let style: string = '';
	export let as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
</script>

<svelte:element this={as} class="Heading" {style}><slot /></svelte:element>

<style>
	.Heading {
		font-size: 1.7rem;
		font-family: 'EB Garamond', serif;
	}
</style>
