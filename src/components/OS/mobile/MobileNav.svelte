<script lang="ts">
	import IconMenu from '@icons/IconMenu.svelte';
	import { widgetNavigationData } from '../../widgets/widgets';
	import { resolve } from '$app/paths';

	let popover: HTMLDivElement;
	const id = $props.id();

	function closePopover() {
		popover?.hidePopover?.();
	}
</script>

<button
	class="menu-btn"
	type="button"
	popovertarget={id}
	popovertargetaction="toggle"
	title="Apps"
	aria-label="Open navigation menu"
>
	<IconMenu />
</button>

<div class="mobile-nav-popover" {id} bind:this={popover} popover>
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
	.mobile-nav-popover {
		inset: calc(100% - 1px) var(--space-2) auto auto;
		margin: 0;
		border: 1px solid var(--win-border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-window);
		background: var(--win-bg);
		display: none;
		overflow: hidden;
		padding: 0;
	}

	.mobile-nav-popover:popover-open {
		display: block;
	}

	.mobile-nav-popover::backdrop {
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

	.menu-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		background: none;
		border: none;
		border-left: 1px solid rgba(212, 245, 214, 0.2);
		color: var(--color-text-light);
		flex-shrink: 0;
	}

	.menu-btn :global(svg) {
		width: 20px;
		height: 20px;
	}

	.menu-btn:hover {
		background: rgba(212, 245, 214, 0.1);
	}

	@media (max-width: 768px) {
		.mobile-nav-popover {
			inset: 44px var(--space-2) auto auto;
		}
	}
</style>
