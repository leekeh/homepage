<script lang="ts">
	export let href: string;
	export let alt: string;
	export let style: string = '';
</script>

<a {href} aria-label={alt} target="_blank" {style}>
	<slot />
</a>

<style>
	a {
		width: 3rem;
		height: 3rem;
		color: var(--accent);
		text-decoration: none;
		padding: 0.5rem;
		position: relative;
		-webkit-tap-highlight-color: transparent;
		border-radius: 100%;
		outline: none;
	}

	a::before {
		position: absolute;
		border-radius: 100%;
		content: '';
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
	}

	@keyframes drawOutline {
		0% {
			clip-path: polygon(50% 0%, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 50%);
		}
		12.5% {
			clip-path: polygon(50% 0%, 100% 0, 100% 0, 100% 0, 100% 0, 100% 0, 50% 50%);
		}
		37.5% {
			clip-path: polygon(50% 0%, 100% 0, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 50% 50%);
		}
		62.5% {
			clip-path: polygon(50% 0%, 100% 0, 100% 100%, 0 100%, 0 100%, 0 100%, 50% 50%);
		}
		87.5% {
			clip-path: polygon(50% 0%, 100% 0, 100% 100%, 0 100%, 0 0, 0 0, 50% 50%);
		}
		100% {
			clip-path: polygon(50% 0%, 100% 0, 100% 100%, 0 100%, 0 0, 50% 0, 50% 50%);
		}
	}

	a:hover::before,
	a:focus-visible::before {
		outline: var(--border-width) solid var(--accent);
		outline-offset: calc(var(--border-width) * -1);
	}
	@media (prefers-reduced-motion: no-preference) {
		a:hover::before,
		a:focus-visible::before {
			animation: drawOutline 0.25s linear;
		}
	}
</style>
