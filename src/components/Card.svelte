<script lang='ts'>
    export let as: Element['tagName'] = 'div';
    export let style: string = '';

</script>


<svelte:element class='Card' this={as} {style}><slot/></svelte:element>

<style>
    .Card {
        background-color: var(--bg-primary);
		border: var(--border-width) solid var(--accent);
		margin: min(5%, 20px);
		padding: 1rem;
		border-radius: var(--border-radius);
		display: flex;
		flex-direction: column;
		gap: max(1rem, 5%);
		align-items: center;
		color: var(--accent);
		text-align: center;
    }

</style>