<script lang="ts">
	export let style: string = '';
	export let as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
</script>

<svelte:element class='Heading' this={as} {style}><slot/></svelte:element>

<style>
	.Heading {
		font-size: 1.7rem;
	}
</style>
