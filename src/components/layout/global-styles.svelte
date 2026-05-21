<script lang="ts">
	import './global-styles.css';
</script>

<svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="0" width="0">
	<defs>
		<filter id="squiggle">
			<feTurbulence id="turbulence" type="fractalNoise" baseFrequency=".05" numOctaves="100" />
			<feDisplacementMap id="displacement" in="SourceGraphic" scale="1.15" />
		</filter>
		<filter id="displaced">
			<feTurbulence id="turbulence" type="fractalNoise" baseFrequency=".05" numOctaves="100" />
			<feDisplacementMap id="displacement" in="SourceGraphic" scale="2" />
		</filter>
	</defs>
</svg>
