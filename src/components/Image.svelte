<script lang="ts">
	import IconPlay from '@icons/IconPlay.svelte';
	import Button from './OS/Button.svelte';
	import IconPause from '@icons/IconPause.svelte';
	import { resolveCreditUrl } from '@utils/url';

	type Props = {
		src: string;
		alt: string;
		caption?: string;
		credit?: string;
		minimal?: boolean;
		/** 'contain' scales the image to fit within the available height as well as width, instead of always spanning the full width. */
		fit?: 'width' | 'contain';
	};

	let { src, alt, caption, credit, minimal, fit = 'width' }: Props = $props();

	let creditUrl = $derived(credit ? resolveCreditUrl(credit) : null);

	let isGif = $derived(src.split('?')[0].toLowerCase().endsWith('.gif'));
	const prefersReducedMotion =
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	let paused = $state(prefersReducedMotion);

	let imgEl: HTMLImageElement | undefined = $state();
	let canvasEl: HTMLCanvasElement | undefined = $state();

	function togglePause() {
		if (!isGif) return;

		if (!paused) {
			// Capture the current frame to canvas before pausing
			if (imgEl && canvasEl) {
				canvasEl.width = imgEl.naturalWidth;
				canvasEl.height = imgEl.naturalHeight;
				canvasEl.getContext('2d')?.drawImage(imgEl, 0, 0);
			}
			paused = true;
		} else {
			paused = false;
		}
	}

	// When starting paused (reduced motion), draw the first frame once both the canvas and image are ready
	$effect(() => {
		if (prefersReducedMotion && canvasEl && imgEl) {
			const draw = () => {
				canvasEl!.width = imgEl!.naturalWidth;
				canvasEl!.height = imgEl!.naturalHeight;
				canvasEl!.getContext('2d')?.drawImage(imgEl!, 0, 0);
			};
			if (imgEl.complete) {
				draw();
			} else {
				imgEl.addEventListener('load', draw, { once: true });
			}
		}
	});
</script>

<figure
	class="container"
	class:squiggle-border={!minimal}
	class:minimal
	class:contain={fit === 'contain'}
>
	<div class="media-wrapper">
		<!-- Always render the img; hide it when paused to freeze the GIF -->
		<img bind:this={imgEl} {src} {alt} class:hidden={isGif && paused} />
		<!-- Canvas shown while paused to display the frozen frame -->
		{#if isGif}
			<canvas bind:this={canvasEl} class:hidden={!paused} aria-hidden="true"></canvas>
		{/if}
	</div>
	{#if isGif}
		<div class="gif-toggle">
			<Button
				class="gif-toggle"
				onclick={togglePause}
				aria-label={paused ? 'Play GIF' : 'Pause GIF'}
			>
				{#if paused}
					<IconPlay />
				{:else}
					<IconPause />
				{/if}
			</Button>
		</div>
	{/if}
	{#if caption}
		<figcaption>{caption}</figcaption>
	{/if}
	{#if credit}
		<p class="credit" class:minimal>
			Source:
			{#if creditUrl}
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<a href={creditUrl} target="_blank" rel="noopener noreferrer nofollow">{credit}</a>
			{:else}
				<span>{credit}</span>
			{/if}
		</p>
	{/if}
</figure>

<style>
	.container {
		border-radius: var(--radius-lg);
		padding: var(--space-4) var(--space-5);
		margin-block: var(--space-7);
		break-inside: avoid;

		&.minimal {
			padding: 0;
			margin-block: 0;
		}

		&.contain {
			display: flex;
			flex-direction: column;
			height: 100%;
		}
	}

	.media-wrapper {
		position: relative;
		width: 100%;
		overflow: hidden;
	}

	.container.contain .media-wrapper {
		flex: 1;
		min-height: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	img,
	canvas {
		width: 100%;
		height: auto;
		display: block;
		object-fit: contain;
	}

	.container.contain img,
	.container.contain canvas {
		width: auto;
		height: auto;
		max-width: 100%;
		max-height: 100%;
	}

	.hidden {
		display: none;
	}

	.gif-toggle {
		float: right;
		padding: var(--space-2) var(--space-3);
		z-index: 4;
	}

	figcaption {
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		text-align: center;
		padding-top: var(--space-3);
	}

	.credit {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs) !important;
		max-width: 100% !important;
		text-align: center;
		padding-top: var(--space-1);
		color: var(--color-fg-muted);
		font-style: italic;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		overflow: hidden;

		&.minimal {
			padding-block-end: var(--space-2);
			padding-inline: var(--space-4);
		}

		a,
		span {
			display: block;
			min-width: 0;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}
	}
</style>
