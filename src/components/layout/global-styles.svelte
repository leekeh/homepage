<script lang="ts">
	import { onMount } from 'svelte';

	import './global-styles.css';

	// Each array ends with its first value repeated (SMIL loop convention).
	// Unique values: first 4 entries for freq/seed arrays, first 5 for warp arrays.
	const noiseAFreqBase = [
		[0.018, 0.028],
		[0.021, 0.031],
		[0.017, 0.026],
		[0.019, 0.033]
	] as const;
	const noiseBFreqBase = [
		[0.03, 0.014],
		[0.026, 0.018],
		[0.034, 0.012],
		[0.028, 0.016]
	] as const;
	const noiseASeeds = [2, 3, 5, 7] as const;
	const noiseBSeeds = [11, 13, 17, 19] as const;
	const warpABase = [1.8, 2.2, 2.6, 2, 2.8] as const;
	const warpBBase = [1.2, 1.6, 1.35, 1.9, 1.25] as const;

	function scaleFrequencyPair([x, y]: readonly [number, number], factor: number) {
		return `${Number((x * factor).toFixed(4))} ${Number((y * factor).toFixed(4))}`;
	}

	let devicePixelRatio = $state(1);
	let referencePixelRatio = $state(1);
	// LCM(4, 5) = 20 covers a full cycle of all animation sequences
	let step = $state(0);

	const normalizedPixelRatio = $derived(
		Number.isFinite(devicePixelRatio) && devicePixelRatio > 0 ? devicePixelRatio : 1
	);
	const densityRatio = $derived(
		referencePixelRatio > 0 ? referencePixelRatio / normalizedPixelRatio : 1
	);
	const displacementCompensation = $derived(Math.sqrt(densityRatio));
	const clampedDisplacementCompensation = $derived(
		Math.min(1.45, Math.max(0.8, displacementCompensation))
	);
	const frequencyCompensation = $derived(1 / Math.sqrt(clampedDisplacementCompensation));

	const noiseAFrequency = $derived(
		scaleFrequencyPair(noiseAFreqBase[step % 4], frequencyCompensation)
	);
	const noiseASeed = $derived(noiseASeeds[step % 4]);
	const noiseBFrequency = $derived(
		scaleFrequencyPair(noiseBFreqBase[step % 4], frequencyCompensation)
	);
	const noiseBSeed = $derived(noiseBSeeds[step % 4]);
	const warpAScale = $derived(
		Number((warpABase[step % 5] * clampedDisplacementCompensation).toFixed(3))
	);
	const warpBScale = $derived(
		Number((warpBBase[step % 5] * clampedDisplacementCompensation).toFixed(3))
	);

	onMount(() => {
		referencePixelRatio =
			Number.isFinite(window.devicePixelRatio) && window.devicePixelRatio > 0
				? window.devicePixelRatio
				: 1;
		const interval = setInterval(() => {
			step = (step + 1) % 20;
		}, 333);
		return () => clearInterval(interval);
	});
</script>

<svelte:window bind:devicePixelRatio />

<svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="0" width="0">
	<defs>
		<filter id="squiggle">
			<feTurbulence
				type="fractalNoise"
				baseFrequency={noiseAFrequency}
				numOctaves="2"
				result="noiseA"
				seed={noiseASeed}
			/>
			<feTurbulence
				type="fractalNoise"
				baseFrequency={noiseBFrequency}
				numOctaves="3"
				result="noiseB"
				seed={noiseBSeed}
			/>
			<feDisplacementMap in="SourceGraphic" in2="noiseA" scale={warpAScale} result="warpA" />
			<feDisplacementMap in="warpA" in2="noiseB" scale={warpBScale} />
		</filter>
	</defs>
</svg>
