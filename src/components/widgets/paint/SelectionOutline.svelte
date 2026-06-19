<script lang="ts">
	interface Props {
		x: number;
		y: number;
		width: number;
		height: number;
	}
	const { x, y, width, height }: Props = $props();
</script>

<svg
	class="selection-outline"
	style={`left: ${x}px; top: ${y}px; width: ${width}px; height: ${height}px;`}
	viewBox={`0 0 ${width} ${height}`}
>
	<rect class="outline" x="0.5" y="0.5" width={width - 1} height={height - 1} />
</svg>

<style>
	.selection-outline {
		position: absolute;
		pointer-events: none;
		z-index: 1;
	}

	.outline {
		stroke: var(--color-fg-highlight);
		stroke-width: 2;
		fill: none;
		stroke-dasharray: 4px, 2px;
		stroke-linecap: round;
		stroke-linejoin: round;
		animation: ant 500ms infinite;
		filter: var(--filter-squiggle);
	}

	@keyframes ant {
		from {
			stroke-dashoffset: 0;
		}
		to {
			stroke-dashoffset: 4;
		}
	}
</style>
