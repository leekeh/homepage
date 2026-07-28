<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { resolve } from '$app/paths';
	import type { PathnameWithSearchOrHash } from '$app/types';

	type AnchorProps = HTMLAnchorAttributes & {
		href: string;
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
Basic polymorphic link component that can be used inside widgets.
 -->

{#if href}
	<a
		class="link"
		href={href.startsWith('/') ? resolve(href as PathnameWithSearchOrHash) : href}
		{...rest as HTMLAnchorAttributes}
	>
		{@render children?.()}
	</a>
{:else}
	<button class="link" {...rest as HTMLButtonAttributes}>
		{@render children?.()}
	</button>
{/if}

<style>
	.link {
		position: relative;
		color: inherit;
		text-decoration: none;
		font-family: var(--font-mono);
		padding-bottom: var(--space-1);
		&::before {
			content: '';
			position: absolute;
			bottom: var(--border-width);
			width: 100%;
			height: var(--border-width);
			background-color: currentColor;
			filter: var(--filter-squiggle);
		}

		/* on hover animate in a background */
		&:hover {
			&::before {
				background-color: var(--color-fg-highlight);
			}
		}
	}
</style>
