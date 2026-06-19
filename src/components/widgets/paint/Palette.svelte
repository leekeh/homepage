<script lang="ts">
	import { useRovingTabindex } from '../../OS/shared/useRovingTabindex.svelte';
	import { paletteColors as colors } from './paletteColors';

	interface Props {
		primaryColor: string;
	}

	let { primaryColor = $bindable() }: Props = $props();
	let paletteActiveIndex = $state(0);

	const paletteRoving = useRovingTabindex({
		selector: '[data-palette-btn]',
		orientation: 'horizontal',
		activeIndex: () => paletteActiveIndex,
		setActiveIndex: (idx) => {
			paletteActiveIndex = idx;
		}
	});

	$effect(() => {
		const index = colors.indexOf(primaryColor);
		if (index !== -1) {
			paletteActiveIndex = index;
		} else {
			paletteActiveIndex = 0;
		}
	});

	function attachPaletteRoving(element: HTMLElement) {
		const cleanup = paletteRoving.attachment(element);
		return {
			destroy: () => {
				if (typeof cleanup === 'function') cleanup();
			}
		};
	}

	function setPrimaryColor(color: string) {
		primaryColor = color;
	}
</script>

<div class="palette-bar" role="toolbar" use:attachPaletteRoving aria-label="Color palette">
	{#each colors as color, idx (color)}
		<button
			class="palette-cell squiggle-border"
			class:selected={primaryColor === color}
			data-palette-btn
			style="background:{color};"
			tabindex={idx === paletteActiveIndex ? 0 : -1}
			onclick={() => setPrimaryColor(color)}
			aria-label={`Color ${color}`}
			aria-pressed={primaryColor === color}
		></button>
	{/each}
</div>

<style>
	.palette-bar {
		padding: var(--space-4);
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		justify-content: center;
		margin-bottom: var(--space-2);
		min-width: 0;
		max-width: 100%;
		scrollbar-gutter: stable both-edges;
		overscroll-behavior: contain;
	}

	.palette-cell {
		width: 24px;
		height: 24px;
		border-radius: var(--radius-round);
		border: none;
		padding: 0;
		cursor: pointer;
		transition: transform 0.1s;
	}

	.palette-cell:hover,
	.palette-cell:focus-visible {
		transform: scale(1.4);
		z-index: 1;
	}

	.palette-cell.selected {
		outline: 4px solid rgb(255, 255, 255);
		outline-offset: -4px;
	}
</style>
