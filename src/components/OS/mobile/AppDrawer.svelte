<script lang="ts">
	import { widgetNavigationData } from '../../widgets/widgets';
	import IconHome from '@icons/IconHome.svelte';
	import { useTime } from '../shared/useTime.svelte';

	let dialog: HTMLDialogElement;
	const id = $props.id();
	let time = $derived(useTime());

	function closeMenu(event?: MouseEvent) {
		event?.preventDefault();
		if (!dialog) return;
		if (dialog.open) {
			dialog.close();
		} else {
			dialog.removeAttribute('open');
		}
	}
</script>

<button class="home-btn" command="show-modal" title="Home" commandfor={id} aria-label="Home">
	<IconHome />
</button>

<dialog class="app-menu-dialog" {id} bind:this={dialog}>
	<div class="app-drawer-surface">
		<header class="app-menu-header">
			<time datetime={time}>{time}</time>
			<button
				class="app-menu-close"
				commandfor={id}
				command="close"
				onclick={closeMenu}
				aria-label="Close menu"
			>
				Close
			</button>
		</header>

		<nav class="app-grid" aria-label="Applications">
			{#each widgetNavigationData as widget (widget.id)}
				<a class="app-grid-item" href={widget.route} onclick={closeMenu}>
					<span class="app-grid-icon" aria-hidden="true">
						<widget.icon />
					</span>
					<span class="app-grid-label">{widget.title}</span>
				</a>
			{/each}
		</nav>
	</div>
</dialog>

<style>
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

	.app-drawer-surface {
		min-height: 100%;
		backdrop-filter: blur(6px);
		background:
			radial-gradient(circle at top right, rgba(255, 255, 255, 0.2), transparent 35%),
			linear-gradient(180deg, rgba(15, 28, 38, 0.42), rgba(9, 22, 32, 0.58));
		padding: var(--space-4) var(--space-4) var(--space-6);
	}

	.app-menu-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-3);
		margin-bottom: var(--space-6);
	}

	.app-menu-close {
		border: 1px solid rgba(255, 255, 255, 0.35);
		background: rgba(229, 236, 239, 0.2);
		color: rgba(255, 255, 255, 0.95);
		border-radius: 999px;
		padding: 0 var(--space-5);
		height: 48px;
		display: inline-flex;
		align-items: center;
		text-decoration: none;
		font-family: var(--font-mono);
		font-size: var(--font-size-base);
		font-weight: 600;
	}

	.app-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: var(--space-6) var(--space-3);
		overflow-y: auto;
		max-height: calc(100dvh - 108px);
		padding: var(--space-1) 0 var(--space-8);
	}

	.app-grid-item {
		color: var(--color-text-light);
		text-decoration: none;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
		font-family: var(--font-mono);
		min-width: 0;
	}

	.app-grid-item:hover,
	.app-grid-item:active {
		opacity: 0.92;
	}

	.app-grid-icon {
		width: 56px;
		height: 56px;
		border-radius: 16px;
		background: rgba(12, 20, 28, 0.4);
		border: 1px solid rgba(255, 255, 255, 0.2);
		display: flex;
		align-items: center;
		justify-content: center;
		backdrop-filter: blur(4px);
	}

	.app-grid-icon :global(svg) {
		width: 30px;
		height: 30px;
	}

	.app-grid-label {
		text-align: center;
		font-size: var(--font-size-md);
		line-height: 1.2;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
		max-width: 100%;
		word-break: break-word;
	}

	@media (max-width: 420px) {
		.app-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		.app-grid-icon {
			width: 52px;
			height: 52px;
		}
	}
</style>
