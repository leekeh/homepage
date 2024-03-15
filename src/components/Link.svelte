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
		color: var(--foreground);
		text-decoration: none;
		padding-bottom: 0.3rem;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		outline: none;
		border: none;
		font-size: inherit;
		user-select: none;
		display: inline-block;
		background: linear-gradient(to right, var(--accent), var(--accent)),
			linear-gradient(to right, var(--accent-subtle), var(--accent-subtle));
		background-size:
			100% 0.1em,
			0 0.1em;
		background-position:
			100% 100%,
			0 100%;
		background-repeat: no-repeat;
		transition: background-size 400ms;
	}

	button:hover,
	button:focus-visible,
	a:hover,
	a:focus-visible {
		background-size:
			0 0.1em,
			100% 0.1em;
	}

	button:focus-visible,
	a:focus-visible {
		outline: var(--border-width) solid var(--foreground);
		outline-offset: 0.3rem;
	}
</style>
