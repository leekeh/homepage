<script lang="ts">
	import { widgetNavigationData } from '@components/widgets/widgets';
	import { resolve } from '$app/paths';
	import IconStart from '@icons/IconStart.svelte';
	import { useRovingTabindex } from '../shared/useRovingTabindex.svelte';
	import { useJsSupport } from '../shared/useJsSupport.svelte';

	const id = $props.id();
	const buttonId = `${id}-button`;

	// context
	const hasJsSupport = $derived(useJsSupport());

	// bindings
	let startButton: HTMLButtonElement;
	let popover: HTMLDivElement;

	// State
	let isOpen = $state(false);
	let activeIndex = $state(0);

	const menuNav = useRovingTabindex({
		selector: '[role="menuitem"]',
		orientation: 'vertical',
		activeIndex: () => activeIndex,
		setActiveIndex: (i) => {
			activeIndex = i;
		},
		onKeydown: (event) => {
			if (event.key === 'Escape') {
				event.preventDefault();
				closePopover(true);
			}
			if (event.key === 'Tab') closePopover(false);
		}
	});

	function openPopoverAt(index = 0) {
		activeIndex = index;
		if (!popover?.matches(':popover-open')) {
			popover?.showPopover?.();
			return;
		}
		menuNav.focusAt(index);
	}

	function closePopover(restoreFocus = false) {
		popover?.hidePopover?.();
		if (restoreFocus) {
			startButton?.focus();
		}
	}

	function onPopoverToggle(event: ToggleEvent) {
		isOpen = event.newState === 'open';
		if (isOpen) {
			menuNav.focusAt(activeIndex);
		}
	}

	function onStartButtonKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			openPopoverAt(0);
			return;
		}
		if (event.key === 'ArrowUp') {
			event.preventDefault();
			openPopoverAt(widgetNavigationData.length - 1);
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

<div
	class="start-popover squiggle-border"
	{id}
	popover
	bind:this={popover}
	ontoggle={onPopoverToggle}
>
	<ul class="start-menu-items" role="menu" {@attach menuNav.attachment} aria-labelledby={buttonId}>
		{#each widgetNavigationData as widget, index (widget.id)}
			<li role="none">
				<a
					class="start-menu-item"
					href={resolve(widget.route)}
					role="menuitem"
					tabindex={hasJsSupport && isOpen ? (index === activeIndex ? 0 : -1) : undefined}
					onclick={() => closePopover(false)}
				>
					<span class="start-menu-icon" aria-hidden="true">
						<widget.icon />
					</span>
					<span class="start-menu-label">{widget.title}</span>
				</a>
			</li>
		{/each}
	</ul>
</div>

<style>
	.start-button {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--space-3);
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

		&:hover {
			box-shadow: inset 0 0 0 4px var(--color-bg-primary);
		}
	}

	.start-button :global(svg) {
		width: 16px;
		height: 16px;
	}

	.start-popover {
		inset: auto auto calc(var(--taskbar-height) + 1px) 0;
		margin: 0;
		border-radius: var(--radius-lg) var(--radius-lg) 0 0;
		background: var(--color-bg-primary);
		border: none;
		display: none;
		overflow: visible;
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
		list-style: none;
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
		background: var(--color-bg-highlight);
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
