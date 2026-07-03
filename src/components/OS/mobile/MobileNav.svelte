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
	/* Sized and styled by MobileShell's :global(.menu-btn) rule */
	.menu-btn {
		border-radius: 0;
	}
</style>
