<script lang="ts">
	import SelectionOutline from '../SelectionOutline.svelte';
	import type { Rect } from '../geometryUtils';

	interface Props {
		selectionRect: Rect | null;
	}

	const { selectionRect }: Props = $props();
</script>

{#if selectionRect}
	<SelectionOutline
		x={selectionRect.x}
		y={selectionRect.y}
		width={selectionRect.width}
		height={selectionRect.height}
	/>
{/if}
