<script lang="ts">
	import type { Snippet } from 'svelte';
	type Props = {
		removeStartPadding?: boolean;
		children?: Snippet;
	};

	let { removeStartPadding = false, children }: Props = $props();
</script>

<!-- 
 @component
  Wrapper for content sections, providing consistent padding and styling for text elements.
 -->

<div class="content{removeStartPadding ? ' remove-start-padding' : ''}">
	{@render children?.()}
</div>

<style>
	.content {
		padding: var(--space-6);
		font-family: var(--font-sans);

		/* anything inside content */
		:global(*) {
			max-width: min(100%, 65ch);
		}
	}

	.content.remove-start-padding {
		padding-top: 0;
	}

	/* target any header inside content */
	.content :global(h1),
	.content :global(h2),
	.content :global(h3),
	.content :global(h4),
	.content :global(h5),
	.content :global(h6) {
		font-family: var(--font-mono);
	}

	.content :global(p) {
		font-family: var(--font-sans);
		font-size: inherit;
		line-height: inherit;
		margin-bottom: var(--space-4);
	}

	.content :global(hr) {
		margin: var(--space-6) 0;
	}

	.content :global(a):not(:has(img)):not(.button) {
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
