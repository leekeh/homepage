<script lang="ts">
	import Button from '@components/OS/Button.svelte';
	import ThumbnailGrid from '@components/ThumbnailGrid.svelte';
	import {
		getFolderMeta,
		getPhotosByFolder,
		photoFilename,
		thumbSrc
	} from '../../../content/folders/server';

	interface Props {
		/** The folder's id, taken from the /[id] route param. */
		id?: string;
	}

	let { id = '' }: Props = $props();

	const folder = $derived(getFolderMeta(id));
	const photos = $derived(getPhotosByFolder(id));
</script>

{#if folder}
	<div class="detail">
		{#if folder.description}
			<p class="description">{folder.description}</p>
		{/if}
		<ThumbnailGrid
			items={photos.map((photo) => ({
				href: `/${id}/${photo.imgId}`,
				src: thumbSrc(photo),
				alt: photo.alt,
				title: photoFilename(photo)
			}))}
		/>
	</div>
{:else}
	<div class="detail not-found">
		<Button href="/">← Back home</Button>
		<p>That folder could not be found!</p>
	</div>
{/if}

<style>
	.detail {
		width: 100%;
		min-height: 100%;
		padding: var(--space-4);
		font-family: var(--font-sans);
	}

	.not-found {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		align-items: flex-start;
	}

	.description {
		margin: 0 0 var(--space-3);
		font-size: var(--font-size-base);
		color: var(--color-fg-subtle);
	}
</style>
