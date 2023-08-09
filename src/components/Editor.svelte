<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { EditorView, drawSelection, keymap } from '@codemirror/view';
	import type { Extension, Transaction } from '@codemirror/state';

	import Button from './Button.svelte';
	import { html } from '@codemirror/lang-html';
	import { defaultKeymap, historyKeymap } from '@codemirror/commands';
	import { defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';

	export let defaultValue: string | undefined = '';

	// Todo add support for multiple files

	// Todo allow for binding of value
	export let value: string | undefined = '';

	let element: HTMLDivElement;
	let preview: HTMLIFrameElement;
	let view: EditorView;

	const basicSetup: Extension = [
		keymap.of([...defaultKeymap, ...historyKeymap]),
		drawSelection(),
		syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
		EditorView.lineWrapping
	];

	function updatePreview() {
		const canvas = preview.contentDocument ?? preview.contentWindow?.document;
		if (canvas) {
			canvas.open();
			canvas.write(view.state.doc.toString());
			canvas.close();
		}
	}

	onMount(() => {
		view = new EditorView({
			parent: element,
			doc: value === '' ? defaultValue : value,
			extensions: [html(), ...basicSetup],
			dispatch: transactionHandler
		});
		updatePreview();
	});
	onDestroy(() => view?.destroy());

	function transactionHandler(tr: Transaction) {
		view.update([tr]);
		if (tr.docChanged) {
			console.log(tr.docChanged);
			updatePreview();
		}
	}

	let availableWidth: number;
</script>

<div class="container">
	<p>Code editor</p>
	<div
		class="splitview"
		class:isHorizontal={availableWidth > 700}
		bind:clientWidth={availableWidth}
	>
		<iframe bind:this={preview} title="preview" />
		<div class="codemirror" bind:this={element} />
	</div>
</div>

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
	iframe {
		min-height: 300px;
		border-bottom: var(--border-width) solid var(--accent);
		overflow: auto;
	}
	.container {
		width: 100%;
		border: var(--border-width) solid var(--accent);
		border-radius: var(--border-radius);
		overflow: hidden;
	}

	.splitview {
		display: grid;
		grid-template-columns: 1fr;
		justify-items: stretch;
		align-items: stretch;
		grid-auto-flow: row;
	}

	p {
		background-color: var(--accent);
		color: var(--bg-primary);
		font-family: 'Wix Madefor Display', sans-serif;
		padding: 0.4rem;
		text-align: center;
	}

	.isHorizontal {
		grid-template-columns: 1fr 1fr;
	}

	.isHorizontal iframe {
		border-bottom: none;
		border-left: var(--border-width) solid var(--accent);
		order: 1;
	}

	.codemirror {
		overflow: auto;
	}
</style>
