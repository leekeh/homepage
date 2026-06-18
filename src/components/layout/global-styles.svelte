<script lang="ts">
	import { onMount } from 'svelte';

	import './global-styles.css';

	const noiseAFreqBase = [
		[0.018, 0.028],
		[0.021, 0.031],
		[0.017, 0.026],
		[0.019, 0.033],
		[0.018, 0.028]
	] as const;
	const noiseBFreqBase = [
		[0.03, 0.014],
		[0.026, 0.018],
		[0.034, 0.012],
		[0.028, 0.016],
		[0.03, 0.014]
	] as const;
	const warpABase = [1.8, 2.2, 2.6, 2, 2.8, 1.8] as const;
	const warpBBase = [1.2, 1.6, 1.35, 1.9, 1.25, 1.2] as const;

	function scaleFrequencyPairs(pairs: readonly (readonly [number, number])[], factor: number) {
		return pairs
			.map(([x, y]) => `${Number((x * factor).toFixed(4))} ${Number((y * factor).toFixed(4))}`)
			.join(';');
	}

	let devicePixelRatio = $state(1);
	let referencePixelRatio = $state(1);

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

	const noiseABaseFrequency = $derived(
		scaleFrequencyPairs(noiseAFreqBase, Number(frequencyCompensation.toFixed(4))).split(';')[0]
	);
	const noiseAFrequencyValues = $derived(
		scaleFrequencyPairs(noiseAFreqBase, Number(frequencyCompensation.toFixed(4)))
	);
	const noiseBBaseFrequency = $derived(
		scaleFrequencyPairs(noiseBFreqBase, Number(frequencyCompensation.toFixed(4))).split(';')[0]
	);
	const noiseBFrequencyValues = $derived(
		scaleFrequencyPairs(noiseBFreqBase, Number(frequencyCompensation.toFixed(4)))
	);

	const warpAScale = $derived(Number((2 * clampedDisplacementCompensation).toFixed(3)));
	const warpAValues = $derived(
		warpABase.map((value) => Number((value * clampedDisplacementCompensation).toFixed(3))).join(';')
	);
	const warpBScale = $derived(Number((1.3 * clampedDisplacementCompensation).toFixed(3)));
	const warpBValues = $derived(
		warpBBase.map((value) => Number((value * clampedDisplacementCompensation).toFixed(3))).join(';')
	);

	onMount(() => {
		referencePixelRatio =
			Number.isFinite(window.devicePixelRatio) && window.devicePixelRatio > 0
				? window.devicePixelRatio
				: 1;
	});
</script>

<svelte:window bind:devicePixelRatio />

<svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="0" width="0">
	<defs>
		<filter id="squiggle">
			<feTurbulence
				type="fractalNoise"
				baseFrequency={noiseABaseFrequency}
				numOctaves="2"
				result="noiseA"
				seed="2"
			>
				<animate
					attributeName="baseFrequency"
					values={noiseAFrequencyValues}
					dur="2s"
					calcMode="discrete"
					repeatCount="indefinite"
				/>
				<animate
					attributeName="seed"
					values="2;3;5;7;2"
					dur="2.6s"
					calcMode="discrete"
					repeatCount="indefinite"
				/>
			</feTurbulence>
			<feTurbulence
				type="fractalNoise"
				baseFrequency={noiseBBaseFrequency}
				numOctaves="3"
				result="noiseB"
				seed="11"
			>
				<animate
					attributeName="baseFrequency"
					values={noiseBFrequencyValues}
					dur="1.8s"
					calcMode="discrete"
					repeatCount="indefinite"
				/>
				<animate
					attributeName="seed"
					values="11;13;17;19;11"
					dur="2.9s"
					calcMode="discrete"
					repeatCount="indefinite"
				/>
			</feTurbulence>
			<feDisplacementMap in="SourceGraphic" in2="noiseA" scale={warpAScale} result="warpA">
				<animate
					attributeName="scale"
					values={warpAValues}
					dur="3s"
					calcMode="discrete"
					repeatCount="indefinite"
				/>
			</feDisplacementMap>
			<feDisplacementMap in="warpA" in2="noiseB" scale={warpBScale}>
				<animate
					attributeName="scale"
					values={warpBValues}
					dur="4.5s"
					calcMode="discrete"
					repeatCount="indefinite"
				/>
			</feDisplacementMap>
		</filter>
	</defs>
</svg>
