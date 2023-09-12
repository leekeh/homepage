<script lang="ts">
	export let style: string = '';
	export let href: string | undefined = undefined;
</script>

{#if href}
	<a {style} on:click {href}>
		<slot />
	</a>
{:else}
	<button {style} on:click>
		<slot />
	</button>
{/if}

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
		display: inline-block;
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
