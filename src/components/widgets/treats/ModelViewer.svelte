<script lang="ts">
	import { onMount } from 'svelte';
	import { modelSrc, posterSrc } from './data';
	import { IconTreats } from '@icons/index';

	interface Props {
		imgId: string;
		title: string;
	}

	let { imgId, title }: Props = $props();

	let ready = $state(false);
	let percent = $state(0);
	let loaded = $state(false);

	let viewer = $state<HTMLElement>();

	onMount(async () => {
		// Import @google/model-viewer on the client only — importing it defines
		// the <model-viewer> custom element and touches `window`, so it must
		// never run during SSR. The module dedupes its own registration.
		await import('@google/model-viewer');
		ready = true;
	});

	// Wire the loader to model-viewer's real download progress once the element
	// exists. Keep it on screen briefly so it never just flashes.
	$effect(() => {
		const el = viewer;
		if (!el) return;

		const shownAt = performance.now();
		const MIN_VISIBLE_MS = 600;
		let timer: ReturnType<typeof setTimeout>;
		const dismiss = () => {
			const wait = Math.max(0, MIN_VISIBLE_MS - (performance.now() - shownAt));
			timer = setTimeout(() => (loaded = true), wait);
		};

		const onProgress = (event: Event) => {
			const ratio = (event as CustomEvent).detail?.totalProgress ?? 0;
			percent = Math.round(ratio * 100);
			if (ratio >= 1) dismiss();
		};
		const onLoad = () => {
			percent = 100;
			dismiss();
		};

		el.addEventListener('progress', onProgress);
		el.addEventListener('load', onLoad);
		return () => {
			el.removeEventListener('progress', onProgress);
			el.removeEventListener('load', onLoad);
			clearTimeout(timer);
		};
	});
</script>

<noscript>
	<div class="viewer-wrap">
		<img
			src={posterSrc(imgId)}
			alt="3D model of {title}"
			style="width: 100%; height: 100%; object-fit: contain;"
		/>
	</div>
</noscript>
{#if ready}
	<div class="viewer-wrap" aria-busy={!loaded} aria-live="polite">
		<model-viewer
			bind:this={viewer}
			alt="3D model of {title}"
			poster={posterSrc(imgId)}
			src={modelSrc(imgId)}
			camera-controls
			tone-mapping="neutral"
			shadow-intensity="0.5"
			touch-action="none"
			interpolation-decay="200"
			auto-rotate
			auto-rotate-delay="0"
			camera-target="-0.003m 0.0722m 0.0391m"
			camera-orbit="0deg 35deg 25m"
			min-camera-orbit="auto 25deg auto"
			max-camera-orbit="auto 75deg auto"
			min-field-of-view="45deg"
			max-field-of-view="50deg"
			enable-pan
			field-of-view="45deg"
			interaction-prompt="none"
		></model-viewer>

		<div class="loader" class:loaded>
			<span class="loader-treat"><IconTreats /></span>
			<span class="loader-label">{`Loading 3D model… ${percent}%`}</span>
			<span class="loader-note">3D scans are big files — hang tight!</span>
		</div>
	</div>
{/if}

<style>
	.viewer-wrap {
		position: relative;
		width: 100%;
		aspect-ratio: 1;
		font-family: var(--font-sans);
	}

	model-viewer {
		width: 100%;
		height: 100%;
		background-color: transparent;
	}

	.loader {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--space-3);
		background: var(--color-bg-primary);
	}

	.loader.loaded {
		opacity: 0;
		pointer-events: none;
	}

	.loader-treat {
		font-size: 2.75rem;
		line-height: 1;
		animation: bob 1.2s ease-in-out infinite;
		:global svg {
			width: 1em;
			height: 1em;
		}
	}

	@keyframes bob {
		0%,
		100% {
			transform: translateY(0) rotate(-4deg);
		}
		50% {
			transform: translateY(-9px) rotate(4deg);
		}
	}

	.loader-label {
		font-size: var(--font-size-sm);
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.02em;
	}

	.loader-note {
		font-size: var(--font-size-xs);
		max-width: 80%;
		text-align: center;
	}

	@media (prefers-reduced-motion: reduce) {
		.loader,
		.loader-treat {
			animation: none;
		}
	}
</style>
