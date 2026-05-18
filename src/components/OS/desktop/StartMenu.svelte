<script lang="ts">
	import { widgetNavigationData } from '@components/widgets/widgets';
	import { resolve } from '$app/paths';
	import IconStart from '@icons/IconStart.svelte';

	let popover: HTMLDivElement;
	const id = $props.id();

	function closePopover() {
		popover?.hidePopover?.();
	}
</script>

<button class="start-button" popovertarget={id} popovertargetaction="toggle">
	<IconStart />
	<span>Start</span>
</button>

<div class="start-popover" {id} popover bind:this={popover}>
	<nav class="start-menu-items" aria-label="Applications">
		{#each widgetNavigationData as widget (widget.id)}
			<a class="start-menu-item" href={resolve(widget.route)} onclick={closePopover}>
				<span class="start-menu-icon" aria-hidden="true">
					<widget.icon />
				</span>
				<span class="start-menu-label">{widget.title}</span>
			</a>
		{/each}
	</nav>
</div>

<style>
	.start-button {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background: var(--win-btn-bg);
		border: 1px solid var(--win-btn-border);
		border-radius: var(--radius-md);
		color: var(--color-text);
		font-family: var(--font-mono);
		font-size: var(--font-size-base);
		font-weight: 600;
		height: 28px;
		flex-shrink: 0;
	}

	.start-button :global(svg) {
		width: 16px;
		height: 16px;
	}

	.start-button:hover {
		background: var(--win-btn-hover);
	}

	.start-popover {
		inset: auto auto calc(var(--taskbar-height) + 2px) var(--space-2);
		margin: 0;
		border: 1px solid var(--win-border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-window);
		background: var(--win-bg);
		display: none;
		overflow: hidden;
		padding: 0;
	}

	.start-popover:popover-open {
		display: flex;
	}

	.start-popover::backdrop {
		background: transparent;
	}

	.start-menu-items {
		display: flex;
		flex-direction: column;
		min-width: 220px;
		padding: var(--space-2) 0;
	}

	.start-menu-item {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-3) var(--space-5);
		color: var(--color-text);
		text-decoration: none;
		font-family: var(--font-mono);
		font-size: var(--font-size-base);
	}

	.start-menu-item:hover,
	.start-menu-item:active {
		background: var(--color-primary);
		color: var(--color-text-light);
	}

	.start-menu-icon {
		width: 20px;
		height: 20px;
		display: grid;
		place-items: center;
	}

	.start-menu-icon :global(svg) {
		width: 16px;
		height: 16px;
	}
</style>
