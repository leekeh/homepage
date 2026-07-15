<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		title: string;
		children: Snippet;
	};

	let { title, children }: Props = $props();
</script>

<section>
	<h3>{title}...</h3>
	<div class="inner">{@render children?.()}</div>
</section>

<style>
	section {
		padding: var(--space-6) var(--space-6);
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	h3 {
		font-size: var(--font-size-sm);
		font-weight: 600;
		color: var(--color-fg-primary);
	}

	div {
		background-color: var(--color-bg-subtle);
		padding: var(--space-4);
	}
</style>
