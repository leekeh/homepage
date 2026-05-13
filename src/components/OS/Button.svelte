<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { resolve } from '$app/paths';
	import type { PathnameWithSearchOrHash } from '$app/types';

	type AnchorProps = HTMLAnchorAttributes & {
		href: PathnameWithSearchOrHash;
		children?: Snippet;
	};

	type ButtonProps = HTMLButtonAttributes & {
		href?: undefined;
		children?: Snippet;
	};

	type Props = AnchorProps | ButtonProps;

	let { children, href, ...rest }: Props = $props();
</script>

<!-- 
@component
Basic polymorphic button component that can be used inside widgets.
 -->

{#if href}
	<a class="button" href={resolve(href)} {...rest as HTMLAnchorAttributes}>
		{@render children?.()}
	</a>
{:else}
	<button class="button" {...rest as HTMLButtonAttributes}>
		{@render children?.()}
	</button>
{/if}

<style>
	.button {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		border: var(--border-width) solid var(--color-border);
	}

	.button:hover {
		background-color: var(--color-button-bg-hover);
	}

	.button:active {
		background-color: var(--color-button-bg-active);
	}
</style>
