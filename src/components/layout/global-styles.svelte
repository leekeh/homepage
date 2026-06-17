<script lang="ts">
	import './global-styles.css';
</script>

<svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="0" width="0">
	<defs>
		<filter id="squiggle">
			<feTurbulence
				type="fractalNoise"
				baseFrequency="0.018 0.028"
				numOctaves="2"
				result="noiseA"
				seed="2"
			>
				<animate
					attributeName="baseFrequency"
					values="0.018 0.028;0.021 0.031;0.017 0.026;0.019 0.033;0.018 0.028"
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
				baseFrequency="0.03 0.014"
				numOctaves="3"
				result="noiseB"
				seed="11"
			>
				<animate
					attributeName="baseFrequency"
					values="0.03 0.014;0.026 0.018;0.034 0.012;0.028 0.016;0.03 0.014"
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
			<feDisplacementMap in="SourceGraphic" in2="noiseA" scale="2" result="warpA">
				<animate
					attributeName="scale"
					values="1.8;2.2;2.6;2;2.8;1.8"
					dur="3s"
					calcMode="discrete"
					repeatCount="indefinite"
				/>
			</feDisplacementMap>
			<feDisplacementMap in="warpA" in2="noiseB" scale="1.3">
				<animate
					attributeName="scale"
					values="1.2;1.6;1.35;1.9;1.25;1.2"
					dur="4.5s"
					calcMode="discrete"
					repeatCount="indefinite"
				/>
			</feDisplacementMap>
		</filter>
	</defs>
</svg>
