<script lang="ts">
	import Image from '@components/Image.svelte';
	import Button from '@components/OS/Button.svelte';
	import IconChevronLeft from '@icons/IconChevronLeft.svelte';
	import IconChevronRight from '@icons/IconChevronRight.svelte';
	import { useWindowManager, useWindowNavigate } from '@components/OS/shared/windowManager.svelte';
	import {
		getAdjacentPhotos,
		getFolderMeta,
		getPhotoById,
		photoSrc
	} from '../../../content/folders/server';

	interface Props {
		/** The folder's id, taken from the /[id]/[photoId] route params. */
		id?: string;
		/** The photo's imgId, taken from the /[id]/[photoId] route params. */
		photoId?: string;
		/** This widget's own window id — lets prev/next replace it in place instead of stacking a new window per photo. */
		windowId?: string;
	}

	let { id = '', photoId = '', windowId }: Props = $props();

	const photo = $derived(getPhotoById(id, photoId));
	const folder = $derived(getFolderMeta(id));
	const adjacent = $derived(getAdjacentPhotos(id, photoId));

	const navigate = useWindowNavigate();
	const wm = useWindowManager();
	const isFocused = $derived(!!windowId && wm.activeWindow?.id === windowId);

	function goToPhoto(targetPhotoId: string | undefined, event: MouseEvent | KeyboardEvent) {
		if (!windowId || !targetPhotoId) return;
		event.preventDefault();
		navigate('photoviewer', { id, photoId: targetPhotoId }, { replaceWindowId: windowId });
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (!isFocused) return;
		const key = e.key;
		switch (key) {
			case 'ArrowLeft':
				goToPhoto(adjacent?.prev?.imgId, e);
				break;
			case 'ArrowRight':
				goToPhoto(adjacent?.next?.imgId, e);
				break;
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if photo && folder}
	<div class="viewer">
		<nav class="pager" aria-label="More photos in {folder.title}">
			{#if adjacent.prev}
				{@const prev = adjacent.prev}
				<Button
					href={`/${id}/${prev.imgId}`}
					onclick={(e: MouseEvent) => goToPhoto(prev.imgId, e)}
					iconOnly
					aria-label="Previous photo"
				>
					<IconChevronLeft />
				</Button>
			{/if}
			{#if adjacent.next}
				{@const next = adjacent.next}
				<Button
					href={`/${id}/${next.imgId}`}
					onclick={(e: MouseEvent) => goToPhoto(next.imgId, e)}
					iconOnly
					aria-label="Next photo"
				>
					<IconChevronRight />
				</Button>
			{/if}
		</nav>
		<Image
			src={photoSrc(photo)}
			alt={photo.alt}
			caption={photo.caption}
			credit={photo.credit}
			minimal
			fit="contain"
		/>
	</div>
{:else if folder}
	<div class="viewer not-found">
		<Button href="/{id}">← Back to {folder.title}</Button>
		<p>That photo could not be found!</p>
	</div>
{:else}
	<div class="viewer not-found">
		<Button href="/">← Back home</Button>
		<p>That folder could not be found!</p>
	</div>
{/if}

<style>
	.viewer {
		position: relative;
		width: 100%;
		height: 100%;
		font-family: var(--font-sans);
	}
	.pager {
		position: absolute;
		top: var(--space-4);
		left: var(--space-4);
		right: var(--space-4);
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
	}

	.not-found {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		align-items: flex-start;
	}
</style>
