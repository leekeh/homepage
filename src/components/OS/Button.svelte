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

	let { children, href, class: className = '', ...rest }: Props = $props();
	const classes = $derived(`button squiggle-border ${className}`.trim());
</script>

<!-- 
@component
Basic polymorphic button component that can be used inside widgets.
 -->

{#if href}
	<a class={classes} href={resolve(href)} {...rest as HTMLAnchorAttributes}>
		{@render children?.()}
	</a>
{:else}
	<button class={classes} {...rest as HTMLButtonAttributes}>
		{@render children?.()}
	</button>
{/if}

<style>
	.button {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		border: none;
		background-color: transparent;
		font-family: var(--font-mono);
		border-radius: var(--radius-lg);
		padding: var(--space-2) var(--space-4);

		&:hover {
			background-color: var(--color-bg-preview);
		}

		&:active,
		&[aria-pressed='true'] {
			background-color: var(--color-bg-highlight);
		}
		:global(svg) {
			stroke-width: 1px;
			filter: var(--filter-squiggle);
		}
	}
</style>
