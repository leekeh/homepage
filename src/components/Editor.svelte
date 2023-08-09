<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { EditorView, drawSelection, keymap } from '@codemirror/view';
	import type { Extension } from '@codemirror/state';

	import Button from './Button.svelte';
	import { html } from '@codemirror/lang-html';
	import { defaultKeymap, historyKeymap } from '@codemirror/commands';
	import { defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';

	export let defaultValue: string | undefined = '';
	export let value: string | undefined = '';

	let element: HTMLDivElement;
	let view: EditorView;

	const basicSetup: Extension = [
		keymap.of([...defaultKeymap, ...historyKeymap]),
		drawSelection(),
		syntaxHighlighting(defaultHighlightStyle, { fallback: true })
	];

	onMount(() => {
		view = new EditorView({
			parent: element,
			doc: value === '' ? defaultValue : value,
			extensions: [html(), ...basicSetup]
		});
	});
	onDestroy(() => view?.destroy());
</script>

<div class="codemirror" bind:this={element} />
<iframe id="preview" title="preview" />
<Button
	onClick={() =>
		view.dispatch({
			changes: { from: 0, to: view.state.doc.toString().length, insert: defaultValue }
		})}>Reset</Button
>

{#if !view}
	<pre>{value ?? defaultValue}</pre>
{/if}

<style>
</style>
