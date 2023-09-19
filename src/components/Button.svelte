<script lang="ts">
	export let style: string = '';
	export let href: string | undefined = undefined;
</script>

<svelte:element this={href ? 'a' : 'button'} {href} {style} on:click>
	<slot name="icon" />
	<span><slot /></span>
</svelte:element>

<style>
	button,
	a {
		background-color: var(--accent);
		color: var(--bg-primary);
		text-decoration: none;
		cursor: pointer;
		padding: 0.6rem 1rem;
		-webkit-tap-highlight-color: transparent;
		border-radius: var(--border-radius);
		outline: none;
		border: none;
		font-family: 'Wix Madefor Display', sans-serif;
		font-size: inherit;
		transition: background-color var(--transition);
		user-select: none;
		display: inline-flex;
		gap: 0.5rem;
		align-items: center;
		justify-content: center;
	}

	button > *,
	a > * {
		vertical-align: middle;
	}

	button:hover,
	button:focus-visible,
	a:hover,
	a:focus-visible {
		background-color: var(--foreground);
	}

	button:focus-visible,
	a:focus-visible {
		outline: var(--border-width) solid var(--foreground);
		outline-offset: var(--border-width);
	}
</style>
