<script lang="ts">
	import IconStart from '@icons/IconStart.svelte';
	import { widgetNavigationData } from '@components/widgets/widgets';
	import AppMenuPopover from '../shared/AppMenuPopover.svelte';

	const id = $props.id();
	const buttonId = `${id}-button`;

	let startButton: HTMLButtonElement;
	let menuPopover: AppMenuPopover;
	let isOpen = $state(false);

	function onStartButtonKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			menuPopover?.openAt(0);
			return;
		}
		if (event.key === 'ArrowUp') {
			event.preventDefault();
			menuPopover?.openAt(widgetNavigationData.length - 1);
		}
	}
</script>

<button
	class="start-button"
	id={buttonId}
	bind:this={startButton}
	popovertarget={id}
	popovertargetaction="toggle"
	onkeydown={onStartButtonKeydown}
	aria-haspopup="menu"
	aria-controls={id}
	aria-expanded={isOpen}
>
	<IconStart />
	<span>Start</span>
</button>

<AppMenuPopover
	{id}
	{buttonId}
	direction="up"
	onClose={() => startButton?.focus()}
	bind:open={isOpen}
	bind:this={menuPopover}
/>

<style>
	.start-button {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-2) var(--space-4);
		background-color: transparent;
		border: none;
		border-radius: var(--radius-md);
		color: var(--color-text);
		font-family: var(--font-mono);
		font-size: var(--font-size-base);
		font-weight: 600;
		height: 28px;
		flex-shrink: 0;
		&:hover {
			box-shadow: inset 0 0 0 4px var(--color-bg-primary);
		}
		:global(svg) {
			width: 16px;
			height: 16px;
		}
	}
</style>
