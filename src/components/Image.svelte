<script lang="ts">
	import IconPlay from '@icons/IconPlay.svelte';
	import Button from './OS/Button.svelte';
	import IconPause from '@icons/IconPause.svelte';

	type Props = {
		src: string;
		alt: string;
		caption?: string;
		credit?: string;
	};

	let { src, alt, caption, credit }: Props = $props();

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

<figure class="squiggle-border container">
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
		<p class="credit">
			Source:
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a href={credit} target="_blank" rel="noopener noreferrer nofollow">{credit}</a>
		</p>
	{/if}
</figure>

<style>
	.container {
		border-radius: var(--radius-lg);
		padding: var(--space-4) var(--space-5);
		margin-block: var(--space-7);
		break-inside: avoid;
	}

	.media-wrapper {
		position: relative;
		width: 100%;
		overflow: hidden;
	}

	img,
	canvas {
		width: 100%;
		height: auto;
		display: block;
		object-fit: contain;
	}

	.hidden {
		display: none;
	}

	.gif-toggle {
		float: right;
		padding: var(--space-2) var(--space-3);
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

		a {
			display: block;
			min-width: 0;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}
	}
</style>
