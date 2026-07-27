<script lang="ts">
	import { onMount } from 'svelte';
	import { modelSrc, posterSrc } from './data';

	interface Props {
		imgId: string;
		title: string;
	}

	let { imgId, title }: Props = $props();

	// Google's <model-viewer>, loaded once from the CDN on the client only —
	// the custom element must never run during SSR.
	const MODEL_VIEWER_SRC =
		'https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js';

	let ready = $state(false);
	let percent = $state(0);
	let loaded = $state(false);

	// A little delight while loading: a treat-ish emoji picked from the title.
	const EMOJI_BY_KEYWORD: [RegExp, string][] = [
		[/cheesecake|cheese/, '🧀'],
		[/cinnamon|roll|bun/, '🥐'],
		[/fig|custard|pie|tart/, '🥧'],
		[/cookie|biscuit/, '🍪'],
		[/donut|doughnut/, '🍩'],
		[/choc/, '🍫'],
		[/cake|milk/, '🍰']
	];
	function emojiForTitle(value: string): string {
		const lower = value.toLowerCase();
		for (const [pattern, emoji] of EMOJI_BY_KEYWORD) {
			if (pattern.test(lower)) return emoji;
		}
		return '🍰';
	}

	let viewer = $state<HTMLElement>();

	onMount(() => {
		// Load the module once; a data-flag guards against re-injecting it.
		if (!document.querySelector(`script[data-model-viewer]`)) {
			const script = document.createElement('script');
			script.type = 'module';
			script.src = MODEL_VIEWER_SRC;
			script.dataset.modelViewer = '';
			document.head.appendChild(script);
		}
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

{#if ready}
	<div class="viewer-wrap">
		<model-viewer
			bind:this={viewer}
			alt="3D model of {title}"
			poster={posterSrc(imgId)}
			src={modelSrc(imgId)}
			loading="lazy"
			camera-controls
			tone-mapping="neutral"
			shadow-intensity="0.5"
			touch-action="none"
			interpolation-decay="200"
			auto-rotate
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
			<span class="loader-treat">{emojiForTitle(title)}</span>
			<progress class="loader-track" value={percent} max="100"> </progress>
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
		border-radius: var(--radius-md);
		background: linear-gradient(110deg, #f7f4d8 30%, #fffef2 50%, #f7f4d8 70%);
		background-size: 200% 100%;
		animation: shimmer 1.4s ease-in-out infinite;
		transition: opacity 0.5s ease;
	}

	.loader.loaded {
		opacity: 0;
		pointer-events: none;
	}

	@keyframes shimmer {
		to {
			background-position: -200% 0;
		}
	}

	.loader-treat {
		font-size: 2.75rem;
		line-height: 1;
		animation: bob 1.2s ease-in-out infinite;
		filter: drop-shadow(0 6px 4px rgba(0, 0, 0, 0.12));
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

	.loader-track {
		width: 62%;
		height: 6px;
		background: rgba(0, 0, 0, 0.1);
		border-radius: var(--radius-round);
		overflow: hidden;
	}

	.loader-fill {
		height: 100%;
		width: 0%;
		background: #333;
		border-radius: inherit;
		transition: width 0.25s ease;
	}

	.loader-label {
		font-size: var(--font-size-sm);
		color: #444;
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.02em;
	}

	.loader-note {
		font-size: var(--font-size-xs);
		color: #8a875f;
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
