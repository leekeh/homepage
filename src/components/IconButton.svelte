<script lang="ts">
	export let href: string;
	export let alt: string;
	export let style: string = '';
</script>

<a {href} aria-label={alt} target="_blank" {style}><slot /></a>

<style>
	a {
		width: 3rem;
		height: 3rem;
		color: var(--accent);
		text-decoration: none;
		border-radius: 100%;
		padding: 0.5rem;
		position: relative;
		-webkit-tap-highlight-color: transparent;
	}

	a:hover,
	a:focus-visible {
		outline: var(--border-width) solid var(--accent);
		outline-offset: calc(var(--border-width) * -1);
	}

	a:active {
		background: var(--accent);
		color: var(--bg-primary);
	}
</style>
