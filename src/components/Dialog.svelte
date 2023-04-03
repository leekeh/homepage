<script lang="ts">
	import { CloseIcon } from '@icons';
	import { IconButton } from '@components';
	export let showModal: boolean;

	let dialog: HTMLDialogElement;

	$: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div on:click|stopPropagation>
		<span>
			<IconButton alt="Close popup" onClick={() => dialog.close()}><CloseIcon /></IconButton>
		</span>
		<slot />
	</div>
</dialog>

<style>
	dialog {
		max-width: var(--max-width);
		border: none;
		padding: 0;
		background-color: transparent;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(3px);
	}

	div {
		border-radius: var(--border-radius);
		border: none;
		padding: 0;
		background-color: var(--bg-primary);
		padding: 1rem;
		margin: 1rem;
	}
	span {
		float: right;
	}
</style>
