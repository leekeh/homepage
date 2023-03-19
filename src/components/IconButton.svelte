<script lang="ts">
	type $$Props =
		| { alt: string; variant?: 'primary' | 'strong' } & (
				| { href: string; onClick?: never }
				| { href?: never; onClick: (e: MouseEvent) => unknown }
		  );

	export let href = '';
	export let alt = '';
	export let variant = 'primary';
	export let onClick = () => {};
</script>

{#if href}
	<a {href} aria-label={alt} target="_blank" class={variant}><slot /></a>
{:else}
	<button aria-label={alt} on:click={onClick} class={variant}><slot /></button>
{/if}

<style>
	a,
	button {
		width: 3rem;
		height: 3rem;
		color: var(--accent);
		text-decoration: none;
		border-radius: 100%;
		padding: 8px;
		position: relative;
		-webkit-tap-highlight-color: transparent;
		background: none;
		border: none;
		cursor: pointer;
	}

	a:hover,
	a:focus-visible,
	button:hover,
	button:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: -2px;
	}

	a:active,
	button:active {
		background: var(--accent);
		color: var(--bg-primary);
	}

	.strong {
		color: var(--bg-primary);
		background-color: var(--accent);
	}

	.strong:hover,
	.strong:focus-visible {
		outline: 2px solid var(--bg-primary);
		outline-offset: -2px;
	}
</style>
