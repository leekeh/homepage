<script lang="ts">
	import { onMount } from 'svelte';
	import { TOOLS, createSelectTool, createTextTool, type BrushSize, type ToolId } from './tools';
	import { createCanvasDrawing } from './useCanvasDrawing.svelte';
	import { persistCanvas, restoreCanvas, saveImage } from './canvasStorage';
	import Toolbar from './Toolbar.svelte';
	import Palette from './Palette.svelte';
	import SelectionOverlay from './tools/SelectionOverlay.svelte';
	import TextOverlay from './tools/TextOverlay.svelte';
	import Button from '@components/OS/Button.svelte';

	interface Props {
		defaultDrawing?: ImageData;
	}

	const { defaultDrawing = undefined }: Props = $props();

	let rootEl: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let canvasWrap: HTMLDivElement;
	let textInputEl = $state<HTMLInputElement | undefined>(undefined);
	let ctx: CanvasRenderingContext2D;

	let activeTool = $state<ToolId>('pencil');
	let brushSize = $state<BrushSize>('3');
	let primaryColor = $state('#69389c');
	let toolbarActiveIndex = $state(0);

	const getBrushSize = () => parseInt(brushSize, 10);
	const persist = () => {
		if (ctx) void persistCanvas(canvas);
	};

	// — Tool hooks —
	const selectTool = createSelectTool({
		getCtx: () => ctx,
		persist
	});

	const textTool = createTextTool({
		getCanvasWrap: () => canvasWrap,
		getCtx: () => ctx,
		getPrimaryColor: () => primaryColor,
		getBrushSize,
		getInputEl: () => textInputEl,
		persist
	});

	// — Active behavior lookup (select + text supply their own via hooks) —
	const getActiveBehavior = () => {
		if (activeTool === 'select') return selectTool.behavior;
		if (activeTool === 'text') return textTool.behavior;
		return TOOLS.find((t) => t.id === activeTool)?.behavior;
	};

	// — Generic drawing attachment —
	const drawing = createCanvasDrawing(() => ({
		getCtx: () => ctx,
		getBehavior: getActiveBehavior,
		getPrimaryColor: () => primaryColor,
		getBrushSize,
		persist,
		onBeforePointerDown: () => {
			if (textTool.visible && activeTool !== 'text') textTool.commit();
		}
	}));

	// Clear selection when switching away from the select tool
	$effect(() => {
		if (activeTool !== 'select' && !drawing.isDrawing && selectTool.selectionRect) {
			selectTool.clear();
		}
	});

	function clearCanvas() {
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		selectTool.clear();
		persist();
	}

	function onWidgetFocusOut(event: FocusEvent) {
		const nextTarget = event.relatedTarget;
		if (nextTarget instanceof Node && rootEl?.contains(nextTarget)) return;
		if (!drawing.isDrawing) selectTool.clear();
	}

	onMount(() => {
		ctx = canvas.getContext('2d', { willReadFrequently: true })!;
		void restoreCanvas(ctx, defaultDrawing);
	});
</script>

<div class="paint" bind:this={rootEl} onfocusout={onWidgetFocusOut}>
	<div class="paint-body">
		<Toolbar
			bind:activeTool
			bind:brushSize
			bind:primaryColor
			bind:activeIndex={toolbarActiveIndex}
		/>

		<noscript>
			Sorry, a lot of things work on this app without JavaScript, but the painting tool is
			unfortunately not one of them. If you want to play around with it, please enable JavaScript
			and reload the page.
		</noscript>

		<div class="canvas-wrap" bind:this={canvasWrap}>
			<canvas
				bind:this={canvas}
				width={2000}
				height={1600}
				tabindex="-1"
				use:drawing.action
				oncontextmenu={(event) => event.preventDefault()}
				onkeydown={(e) => {
					if (
						(e.key === 'Delete' || e.key === 'Backspace') &&
						activeTool === 'select' &&
						selectTool.selectionRect
					) {
						e.preventDefault();
						selectTool.deleteSelection();
					}
				}}
				aria-label="Drawing canvas"
			></canvas>
			<SelectionOverlay selectionRect={selectTool.selectionRect} />
			<TextOverlay {textTool} {primaryColor} bind:inputEl={textInputEl} />
		</div>
	</div>

	<Palette bind:primaryColor />

	<div class="actions">
		<Button onclick={clearCanvas}>Clear canvas</Button>
		<Button onclick={() => saveImage(canvas, canvasWrap)}>Download</Button>
	</div>
</div>

<style>
	.paint {
		display: flex;
		flex-direction: column;
		height: 100%;
		font-family: var(--font-sans);
	}

	.paint-body {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;
		gap: var(--space-2);
		padding: var(--space-4);
		z-index: 1;
	}

	.paint-body {
		flex-direction: row;
	}

	.canvas-wrap {
		order: 2;
	}

	.canvas-wrap {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		position: relative;
		min-height: 180px;
		border: var(--border-width) solid var(--color-fg-primary);
	}

	canvas {
		display: block;
		background: #ffffff;
		image-rendering: pixelated;
		touch-action: none;
		cursor: crosshair;
	}

	.actions {
		padding: var(--space-4);
		display: flex;
		gap: var(--space-4);
		justify-content: flex-end;
		font-size: var(--font-size-s);
	}
</style>
