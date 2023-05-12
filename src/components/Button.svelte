<script lang="ts">
	export let style: string = '';
</script>

<button {style}>
	<slot />
</button>

<style>
	button {
		background-color: var(--accent);
		color: var(--bg-primary);
		text-decoration: none;
		cursor: pointer;
		padding: 0.6rem 1rem;
		position: relative;
		-webkit-tap-highlight-color: transparent;
		border-radius: var(--border-radius);
		outline: none;
		border: none;
		font-family: 'Wix Madefor Display', sans-serif;
		font-size: inherit;
		transition: var(--transition);
		user-select: none;
	}

	button:hover,
	button:focus-visible {
		background-color: var(--foreground);
	}

	button:focus-visible {
		outline: var(--border-width) solid var(--foreground);
		outline-offset: var(--border-width);
	}
</style>
