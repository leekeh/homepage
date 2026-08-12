<script lang="ts">
	import Button from '@components/OS/Button.svelte';
	import { useRovingTabindex } from '../../OS/shared/useRovingTabindex.svelte';
	import { TOOLS, SIZE_OPTIONS, type BrushSize, type ToolId } from './tools';

	interface Props {
		activeTool: ToolId;
		brushSize: BrushSize;
		primaryColor: string;
		activeIndex?: number;
	}

	let {
		activeTool = $bindable(),
		brushSize = $bindable(),
		primaryColor = $bindable(),
		activeIndex = $bindable(0)
	}: Props = $props();

	let toolbarEl: HTMLElement;

	const toolsRoving = useRovingTabindex({
		selector: '[data-toolbar-item]',
		orientation: 'both',
		activeIndex: () => activeIndex,
		setActiveIndex: (idx) => {
			activeIndex = idx;
		}
	});

	function attachToolsRoving(element: HTMLElement) {
		const cleanup = toolsRoving.attachment(element);
		return {
			destroy: () => {
				if (typeof cleanup === 'function') cleanup();
			}
		};
	}

	function setTool(tool: ToolId, index: number) {
		activeTool = tool;
		activeIndex = index;
	}

	function setBrushSize(size: BrushSize, index: number) {
		brushSize = size;
		activeIndex = index;
	}
</script>

<div
	class="toolbar"
	bind:this={toolbarEl}
	role="toolbar"
	use:attachToolsRoving
	aria-label="Drawing tools"
>
	<div class="tools">
		{#each TOOLS as tool, idx (tool.id)}
			<button
				type="button"
				class="tool-btn"
				class:squiggle-border={activeTool === tool.id}
				data-toolbar-item
				data-tool-id={tool.id}
				tabindex={activeIndex === idx ? 0 : -1}
				onclick={() => setTool(tool.id, idx)}
				aria-label={tool.label}
				aria-pressed={activeTool === tool.id}
			>
				<tool.icon />
			</button>
		{/each}
	</div>
	<div class="divider"></div>

	<div class="size-section">
		<span class="size-label" id="size-label">Size:</span>
		<div class="size-buttons" role="group" aria-labelledby="size-label">
			{#each SIZE_OPTIONS as size, idx (size)}
				<Button
					data-toolbar-item
					tabindex={activeIndex === TOOLS.length + idx ? 0 : -1}
					onclick={() => setBrushSize(size, TOOLS.length + idx)}
					aria-label={`Brush size ${size} pixels`}
					aria-pressed={brushSize === size}
				>
					{size}
				</Button>
			{/each}
		</div>
	</div>

	<div class="divider"></div>

	<div class="color-section">
		<label class="size-label" for="custom-color">Color:</label>
		<input
			class="custom-color squiggle-border"
			id="custom-color"
			type="color"
			data-toolbar-item
			tabindex={activeIndex === TOOLS.length + SIZE_OPTIONS.length ? 0 : -1}
			onfocus={() => (activeIndex = TOOLS.length + SIZE_OPTIONS.length)}
			bind:value={primaryColor}
			aria-label="Custom color picker"
		/>
	</div>
</div>

<style>
	.toolbar {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
		border-radius: var(--radius-sm);
		overflow: auto;
		scrollbar-gutter: stable both-edges;
		overscroll-behavior: contain;
		justify-content: flex-start;
		align-items: center;
	}

	.tools {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		padding: var(--space-2);
		min-width: 100%;
		flex-shrink: 0;
	}

	.tool-btn {
		width: 40px;
		height: 40px;
		flex-shrink: 0;
		display: flex;
		filter: var(--filter-squiggle);
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		border-radius: var(--radius-round);
		color: #000;
		padding: 0;
		cursor: pointer;
		:global(svg) {
			width: 32px;
			height: 32px;
		}
	}

	.tool-btn:hover {
		background: var(--color-bg-preview);
	}

	.tool-btn:active {
		background: var(--color-bg-highlight);
	}

	.divider {
		width: 28px;
		height: var(--border-width);
		background: var(--color-fg-primary);
		filter: var(--filter-squiggle);
	}

	.size-section,
	.color-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-1);
		min-width: 0;
	}

	.size-label {
		font-size: var(--font-size-s);
		font-family: var(--font-mono);
		font-weight: 500;
		letter-spacing: 0.5px;
	}

	.custom-color {
		padding: var(--space-1) var(--space-2);
		border: var(--border-width) solid var(--color-fg-primary);
		border-radius: var(--radius-sm);
		background: transparent;
		color: #000;
		font-family: var(--font-sans);
		cursor: pointer;
		font-size: var(--font-size-sm);
		min-width: 42px;
		min-height: 42px;
		&:hover {
			background-color: var(--color-bg-preview);
		}

		&:active {
			background-color: var(--color-bg-highlight);
		}
	}

	.size-buttons {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--space-2) var(--space-4);
	}
</style>
