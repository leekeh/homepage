<script lang="ts">
	export let style: string = '';
	export let href: string | undefined = undefined;
	export let onClick: undefined | (() => unknown) = undefined;
</script>

{#if href}
	<a {style} on:click={onClick} {href}>
		<slot />
	</a>
{:else}
	<button {style} on:click={onClick}>
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
		transition: var(--transition);
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
