<script lang="ts">
	import { widgetNavigationData } from '../../widgets/widgets';
	import { resolve } from '$app/paths';
	import IconApps from '@icons/IconApps.svelte';
	import { useTime } from '../shared/useTime.svelte';
	import AppIcon from '../shared/AppIcon.svelte';
	import Button from '../Button.svelte';

	let dialog: HTMLDialogElement;
	const id = $props.id();
	let time = $derived(useTime());

	function closeMenu() {
		dialog?.close();
	}
</script>

<button class="squiggled" command="show-modal" title="Home" commandfor={id} aria-label="Home">
	<IconApps />
</button>

<dialog class="app-menu-dialog" {id} bind:this={dialog}>
	<header class="app-menu-header">
		<time datetime={time}>{time}</time>
		<Button commandfor={id} command="close" aria-label="Close menu">Close</Button>
	</header>

	<nav aria-label="Applications">
		<ul class="app-grid">
			{#each widgetNavigationData as widget (widget.id)}
				<li>
					<a class="app-grid-item" href={resolve(widget.route)} onclick={closeMenu}>
						<AppIcon icon={widget.icon} label={widget.title} />
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</dialog>

<style>
	button {
		background-color: transparent;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		min-width: 48px;
		border-radius: 999px;
		:global(svg) {
			width: 24px;
			height: 24px;
		}
		&:hover {
			box-shadow: inset 0 0 0 4px var(--color-bg-primary);
		}
	}
	.app-menu-dialog {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100dvh;
		max-width: none;
		max-height: none;
		border: none;
		border-radius: 0;
		padding: 0;
		margin: 0;
		background: url('/bg.png') center / cover no-repeat;
		color: var(--color-text-light);
		box-shadow: none;
		overflow: hidden;
	}

	.app-menu-dialog::backdrop {
		background: transparent;
	}

	.app-menu-header {
		display: flex;
		justify-content: space-between;
		background-color: black;
		color: white;
		min-height: var(--taskbar-height);
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-2) var(--space-4);
		margin-bottom: var(--space-6);
	}

	.app-grid {
		display: grid;
		list-style: none;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: var(--space-6) var(--space-3);
		overflow-y: auto;
		max-height: calc(100dvh - 108px);
		padding: var(--space-1) 0 var(--space-8);
	}

	.app-grid-item {
		text-decoration: none;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
		min-width: 0;
	}

	.app-grid-item:hover,
	.app-grid-item:active {
		opacity: 0.92;
	}

	time {
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		letter-spacing: 0.05em;
	}

	@media (max-width: 420px) {
		.app-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
