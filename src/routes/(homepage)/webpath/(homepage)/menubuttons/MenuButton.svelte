<script lang="ts">
	export let style: string = '';
	export let href: string;
	export let type: 'HTML' | 'CSS' | 'JS' | 'other';
	import HtmlLogo from './HTMLLogo.svelte';
	import CSSLogo from './CSSLogo.svelte';
	import JsLogo from './JSLogo.svelte';
	import CodeIcon from './CodeIcon.svelte';
	import type { SvelteComponent } from 'svelte';

	let logo: typeof SvelteComponent;
	let string: string;
	switch (type) {
		case 'HTML':
			logo = HtmlLogo;
			string = 'HTML';
			break;
		case 'CSS':
			logo = CSSLogo;
			string = 'CCS';
			break;
		case 'JS':
			logo = JsLogo;
			string = 'JavaScript';
			break;
		default:
			logo = CodeIcon;
			string = 'Other skills';
			break;
	}
</script>

<a href={`webpath/${href}`} {style}>
	<svelte:component this={logo} />
	{string}
</a>

<style>
	a {
		color: var(--foreground);
		text-decoration: none;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		outline: var(--border-width) solid var(--foreground);
		border-radius: var(--border-radius);
		padding: 0.5rem;
		transition: outline-offset var(--transition), background-color var(--transition);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-family: 'Wix Madefor Display', sans-serif;
		font-weight: 900;
	}

	a:hover,
	a:focus-visible {
		outline-offset: 0.3rem;
		background-color: var(--accent-subtle);
	}
</style>
