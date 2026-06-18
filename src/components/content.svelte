<!-- 
 @component
  Wrapper for content sections, providing consistent padding and styling for text elements.
 -->

<div class="content">
	<slot />
</div>

<style>
	.content {
		padding: var(--space-6);
	}

	/* target any header inside content */
	.content :global(h1),
	.content :global(h2),
	.content :global(h3),
	.content :global(h4),
	.content :global(h5),
	.content :global(h6) {
		font-family: var(--font-serif);
	}

	.content :global(p) {
		font-family: var(--font-sans);
		font-size: inherit;
		line-height: inherit;
		max-width: 65ch;
	}

	.content :global(p:not(:first-child)) {
		margin-block: var(--space-4);
	}

	.content :global(hr) {
		margin: var(--space-6) 0;
	}

	.content :global(a) {
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
			transform-origin: right;
		}

		/* on hover animate in a background */
		&:hover {
			&::before {
				filter: var(--filter-squiggle);
			}
		}
	}
</style>
