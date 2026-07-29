<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { resolvePath } from '@utils/resolve';
	import type { PathnameWithSearchOrHash } from '$app/types';

	type AnchorProps = HTMLAnchorAttributes & {
		href: PathnameWithSearchOrHash;
		children?: Snippet;
		iconOnly?: boolean;
	};

	type ButtonProps = HTMLButtonAttributes & {
		href?: undefined;
		children?: Snippet;
		iconOnly?: boolean;
	};

	type Props = AnchorProps | ButtonProps;

	let { children, href, class: className = '', iconOnly = false, ...rest }: Props = $props();
	const classes = $derived(
		`button squiggle-border ${className} ${iconOnly ? 'icon-only' : ''}`.trim()
	);
</script>

<!-- 
@component
Basic polymorphic button component that can be used inside widgets.
 -->

{#if href}
	<a class={classes} href={resolvePath(href)} {...rest as HTMLAnchorAttributes}>
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
		background-color: var(--color-bg-primary);
		color: var(--color-fg-primary);
		font-family: var(--font-mono);
		border-radius: var(--radius-lg);
		padding: var(--space-2) var(--space-4);

		&.icon-only {
			aspect-ratio: 1/1;
			border-radius: var(--radius-round);
			flex-shrink: 0;
			flex-grow: 0;

			:global(svg) {
				width: 1.4em;
				height: 1.4em;
			}
		}

		&:hover {
			background-color: var(--color-bg-hover);
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
