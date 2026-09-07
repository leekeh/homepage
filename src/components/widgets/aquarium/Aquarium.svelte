<script lang="ts">
	import { onMount } from 'svelte';
	import { createAquarium } from './aquariumEngine';

	let root: HTMLDivElement;
	let canvas: HTMLCanvasElement;

	const aquarium = createAquarium(() => canvas);

	onMount(() => {
		// Size the scene to whatever host we land in: a fixed transparent minimal
		// window on desktop, or the full-bleed tabpanel on mobile.
		const observer = new ResizeObserver((entries) => {
			const rect = entries[0]?.contentRect;
			if (rect) aquarium.resize(rect.width, rect.height);
		});
		observer.observe(root);

		aquarium.start();

		return () => {
			observer.disconnect();
			aquarium.stop();
		};
	});
</script>

<!--
	@component
	Retro aquarium screensaver. Fish drift and bob, plants sway on the floor.
	The whole scene renders into a low-res buffer and upscales with nearest-
	neighbour for a chunky, "compressed" look. Configure sprites in
	./aquarium.config.ts. Honors prefers-reduced-motion (renders a static frame).
-->
<div class="aquarium" bind:this={root}>
	<canvas bind:this={canvas} aria-hidden="true"></canvas>
</div>

<style>
	.aquarium {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		/* Chunky tank frame */
		border: 5px solid #2c4657;
		border-radius: var(--radius-lg);
		/* Glass depth: inner rim highlight, surface sheen at top, shadow at floor */
		box-shadow:
			inset 0 0 0 2px rgba(255, 255, 255, 0.18),
			inset 0 10px 22px rgba(180, 230, 255, 0.15),
			inset 0 -14px 26px rgba(0, 40, 70, 0.3);
	}

	/* Bright waterline highlight just under the top frame */
	.aquarium::before {
		content: '';
		position: absolute;
		inset: 0 0 auto 0;
		height: 3px;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
		pointer-events: none;
		z-index: 1;
	}

	canvas {
		display: block;
		width: 100%;
		height: 100%;
		image-rendering: pixelated;
	}
</style>
