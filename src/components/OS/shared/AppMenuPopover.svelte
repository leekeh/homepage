<script lang="ts">
	import { widgetNavigationData } from '@components/widgets/widgets';
	import { resolve } from '$app/paths';
	import { useRovingTabindex } from './useRovingTabindex.svelte';
	import { useJsSupport } from './useJsSupport.svelte';

	interface Props {
		id: string;
		/** ID of the trigger button, for aria-labelledby on the menu */
		buttonId?: string;
		/** 'up' opens above its anchor (desktop taskbar); 'down' opens below (mobile top bar) */
		direction?: 'up' | 'down';
		/** Called after the menu closes via Escape, so the parent can restore focus */
		onClose?: () => void;
		/** Bindable open state so the trigger button can reflect aria-expanded */
		open?: boolean;
	}

	let { id, buttonId, direction = 'down', onClose, open = $bindable(false) }: Props = $props();

	const hasJsSupport = $derived(useJsSupport());

	let popover: HTMLDivElement;
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
				close();
				onClose?.();
			}
			if (event.key === 'Tab') close();
		}
	});

	export function openAt(index = 0) {
		activeIndex = index;
		if (!popover?.matches(':popover-open')) {
			popover?.showPopover?.();
			return;
		}
		menuNav.focusAt(index);
	}

	export function close() {
		popover?.hidePopover?.();
	}

	function onToggle(event: ToggleEvent) {
		open = event.newState === 'open';
		if (open) menuNav.focusAt(activeIndex);
	}
</script>

<div
	class="app-menu-popover squiggle-border"
	{id}
	class:direction-up={direction === 'up'}
	class:direction-down={direction === 'down'}
	popover
	bind:this={popover}
	ontoggle={onToggle}
>
	<ul class="menu-items" role="menu" {@attach menuNav.attachment} aria-labelledby={buttonId}>
		{#each widgetNavigationData as widget, index (widget.id)}
			<li role="none">
				<a
					class="menu-item"
					href={resolve(widget.route)}
					role="menuitem"
					tabindex={hasJsSupport && open ? (index === activeIndex ? 0 : -1) : undefined}
					onclick={() => close()}
				>
					<span class="menu-icon" aria-hidden="true">
						<widget.icon />
					</span>
					<span class="menu-label">{widget.title}</span>
				</a>
			</li>
		{/each}
	</ul>
</div>

<style>
	.app-menu-popover {
		margin: 0;
		display: none;
		overflow: visible;
		padding: 0;
		--radius: var(--radius-lg);
		background: var(--color-bg-primary);
		border: none;

		&::backdrop {
			background: transparent;
		}
	}

	/* Direction: up — opens above the taskbar (desktop start menu) */
	.direction-up {
		inset: auto auto calc(var(--taskbar-height) + 1px) 0;
		border-radius: var(--radius) var(--radius) var(--radius) 0;

		&:popover-open {
			display: flex;
		}
	}

	/* Direction: down — opens below the top bar (mobile nav) */
	.direction-down {
		inset: var(--taskbar-height) 0 auto auto;
		border-radius: var(--radius) 0 var(--radius) var(--radius);

		&:popover-open {
			display: block;
		}
	}

	/* Items */
	.menu-items {
		border-radius: inherit;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		list-style: none;
		min-width: 220px;
	}

	.menu-item {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-3) var(--space-5);
		color: var(--color-text);
		text-decoration: none;
		font-family: var(--font-mono);
		font-size: var(--font-size-base);

		&:hover,
		&:active {
			background: var(--color-bg-highlight);
		}
	}

	.menu-icon {
		width: 24px;
		height: 24px;
		display: grid;
		place-items: center;

		:global(svg) {
			width: 24px;
			height: 24px;
		}
	}
</style>
