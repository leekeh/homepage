<script>
	const content =
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

	// <details> elements that share a "name" form one exclusive group —
	// opening one automatically closes the others. No JS state needed.
	// Give separate accordions on the same page different names, or leave
	// this prop unset and they'll each behave as an independent group.
	export let name = 'accordion';
</script>

<div class="container">
	<p>Here is a very basic example to illustrate that:</p>
	<div class="accordion">
		{#each [1, 2, 3] as i (i)}
			<details {name}>
				<summary><h4>Header {i}</h4></summary>
				<div class="content">{content}</div>
			</details>
		{/each}
	</div>
</div>

<style>
	.container {
		margin-block: var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.accordion {
		border: var(--border-width) solid var(--color-fg-primary);
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	details {
		border-bottom: var(--border-width) solid var(--color-fg-primary);
	}

	details:last-child {
		border-bottom: none;
	}

	summary {
		list-style: none; /* removes default marker in Chrome/Safari */
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		padding: 0.9rem 1rem;
		cursor: pointer;
		font-family: var(--font-mono);
		font-size: var(--font-size-base);
		font-weight: 600;
	}

	summary::-webkit-details-marker {
		display: none; /* removes default marker in older WebKit */
	}

	summary::after {
		content: '»' / '""';
		font-size: 1.1rem;
		line-height: 1;
		flex-shrink: 0;
		transition: transform 0.15s ease;
		transform: rotate(90deg);
	}

	details[open] summary::after {
		transform: rotate(270deg);
	}

	.content {
		padding: 0 1rem 1rem;
	}
</style>
