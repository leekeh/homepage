<script lang="ts">
	import type { Component } from 'svelte';

	interface Props {
		icon: Component;
		label: string;
	}

	let { icon: Icon, label }: Props = $props();
</script>

<div class="icon-image" aria-hidden="true">
	<Icon />
</div>
<span class="icon-label">{label}</span>

<style>
	.icon-image {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text-light);
		animation: var(--animation-squiggle);

		& :global(svg) {
			width: 56px;
			height: 48px;
		}
	}

	.icon-label {
		color: var(--color-text-light);
		background-color: var(--color-bg-primary);
		padding: 2px 4px;
		font-size: var(--font-size-sm);
		font-weight: 500;
		font-family: var(--font-mono);
		text-align: center;
		word-break: break-word;
		line-height: 1.2;
	}
</style>
