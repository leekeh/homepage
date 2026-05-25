<script lang="ts">
	import IconMenu from '@icons/IconMenu.svelte';
	import AppMenuPopover from '../shared/AppMenuPopover.svelte';

	const id = $props.id();
	const buttonId = `${id}-button`;

	let menuBtn: HTMLButtonElement;
</script>

<button
	class="menu-btn squiggled"
	id={buttonId}
	bind:this={menuBtn}
	popovertarget={id}
	popovertargetaction="toggle"
	title="Apps"
	aria-label="Open navigation menu"
	aria-haspopup="menu"
	aria-controls={id}
>
	<IconMenu />
</button>

<AppMenuPopover {id} {buttonId} direction="down" onClose={() => menuBtn?.focus()} />

<style>
	.menu-btn {
		background-color: transparent;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		min-width: 48px;
		border-radius: 999px;
		&:hover {
			box-shadow: inset 0 0 0 4px var(--color-bg-primary);
		}
	}

	.menu-btn :global(svg) {
		width: 20px;
		height: 20px;
	}

	.menu-btn:hover {
		background: rgba(212, 245, 214, 0.1);
	}
</style>
