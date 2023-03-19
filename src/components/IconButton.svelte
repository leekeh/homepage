<script lang="ts">
	export let href: string;
	export let alt: string;
</script>

<a {href} aria-label={alt} target="_blank"><slot /></a>

<style>
	a {
		width: 3rem;
		height: 3rem;
		color: inherit;
		text-decoration: none;
		border-radius: 100%;
		padding: 8px;
		position: relative;
		-webkit-tap-highlight-color: transparent;
	}

	a:hover,
	a:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: -2px;
	}

	a:active {
		background: var(--accent);
		color: var(--bg-primary);
	}
</style>
