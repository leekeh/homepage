<script lang="ts">
	import type { createTextTool } from './text.svelte';

	type TextTool = ReturnType<typeof createTextTool>;

	interface Props {
		textTool: TextTool;
		primaryColor: string;
		inputEl?: HTMLInputElement;
	}

	let { textTool, primaryColor, inputEl = $bindable(undefined) }: Props = $props();
</script>

{#if textTool.visible}
	<input
		class="text-input-overlay"
		bind:this={inputEl}
		type="text"
		value={textTool.value}
		size={textTool.inputSize}
		style:left={`${textTool.x}px`}
		style:top={`${textTool.y - 2}px`}
		style:color={primaryColor}
		style:font-family={textTool.getFontFamily()}
		style:font-size={`${textTool.getFontSize()}px`}
		oninput={(e) => {
			textTool.value = e.currentTarget.value;
			void textTool.syncPosition();
		}}
		onpointerdown={textTool.onPointerDown}
		onpointermove={textTool.onPointerMove}
		onpointerup={textTool.onPointerUp}
		onpointercancel={textTool.onPointerUp}
		onblur={textTool.commit}
		onkeydown={(event) => {
			if (event.key === 'Enter') {
				event.preventDefault();
				textTool.commit();
			}
			if (event.key === 'Escape') {
				event.preventDefault();
				textTool.cancel();
			}
		}}
		aria-label="Text input"
	/>
{/if}

<style>
	.text-input-overlay {
		position: absolute;
		z-index: 2;
		max-width: calc(100% - 12px);
		margin: 0;
		padding: 0;
		background-color: transparent;
		box-sizing: border-box;
		border: none;
		font-family: var(--font-sans);
		line-height: 1;
		outline: none;
		box-shadow: none;
		appearance: none;
		-webkit-appearance: none;
		cursor: move;
	}
</style>
