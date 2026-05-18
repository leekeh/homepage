<script lang="ts">
	import type { Snippet } from 'svelte';
	import { useWindowManager } from '../shared/windowManager.svelte';
	import { getWidgetById, loadWidgetComponent, widgetNavigationData } from '../../widgets/widgets';
	import Window from '../window/Window.svelte';
	import MinimalWindow from '../window/MinimalWindow.svelte';
	import DesktopIcon from '../desktop/DesktopIcon.svelte';
	import IconStart from '@icons/IconStart.svelte';
	import { useJsSupport } from '../shared/useJsSupport.svelte';
	import { useTime } from '../shared/useTime.svelte';
	import { resolve } from '$app/paths';
	import StartMenu from './StartMenu.svelte';

	type Props = {
		children?: Snippet;
	};

	let { children }: Props = $props();

	const wm = $derived(useWindowManager());
	const hasJsSupport = $derived(useJsSupport());
	const time = $derived(useTime());

	// Interactions
	function focusWindow(id: string) {
		const win = wm.windows.find((w) => w.id === id);
		if (win?.minimized) win.minimized = false;
		wm.focus(id);
	}
</script>

<footer class="taskbar">
	<StartMenu />
	<hr class="divider" />

	<ul class="window-buttons">
		{#each wm.windows as win (win.id)}
			{@const isActive = wm.activeWindow?.id === win.id && !win.minimized}
			<li>
				<button
					class="window-button"
					class:active={isActive}
					class:minimized={win.minimized}
					onclick={() => focusWindow(win.id)}
					title={win.title}
				>
					<span class="window-button-text">{win.title}</span>
				</button>
			</li>
		{/each}
	</ul>

	<div class="clock-area">
		<time class="clock" datetime={time}>{time}</time>
	</div>
</footer>

<style>
	.taskbar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: var(--taskbar-height);
		background: linear-gradient(180deg, #1a4d1a 0%, #0d2e0d 100%);
		border-top: 1px solid var(--color-primary-light);
		display: flex;
		align-items: center;
		padding: 0 var(--space-2);
		gap: var(--space-1);
		z-index: var(--z-taskbar);
	}

	.divider {
		width: 1px;
		height: 24px;
		background: var(--color-primary-light);
		opacity: 0.4;
		flex-shrink: 0;
	}

	.window-buttons {
		display: flex;
		list-style: none;
		flex: 1;
		gap: var(--space-1);
		overflow: hidden;
	}

	.window-button {
		display: flex;
		align-items: center;
		padding: var(--space-2) var(--space-4);
		background: rgba(212, 245, 214, 0.1);
		border: 1px solid rgba(212, 245, 214, 0.15);
		border-radius: var(--radius-md);
		color: var(--color-text-light);
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		height: 26px;
		max-width: 160px;
		flex-shrink: 0;
		overflow: hidden;
	}

	.window-button:hover {
		background: rgba(212, 245, 214, 0.2);
	}

	.window-button.active {
		background: rgba(0, 84, 9, 0.6);
		border-color: var(--color-primary-light);
		box-shadow: var(--shadow-sunken);
	}

	.window-button.minimized {
		opacity: 0.6;
	}

	.window-button-text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.clock-area {
		display: flex;
		align-items: center;
		padding: var(--space-2) var(--space-4);
		border-left: 1px solid rgba(212, 245, 214, 0.2);
		flex-shrink: 0;
	}

	.clock {
		color: var(--color-text-light);
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		letter-spacing: 0.05em;
	}
</style>
