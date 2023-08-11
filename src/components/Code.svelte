<script lang="ts">
	import { Copy } from '@icons';
	import hljs from 'highlight.js/lib/common';
	import 'highlight.js/styles/stackoverflow-dark.css';
	import IconButton from './IconButton.svelte';
	export let style: string = '';
	export let lang: string;
	export let content: string;
	export let type: 'inline' | 'standalone' = 'standalone';

	const copyContent = () => {
		navigator.clipboard.writeText(content);
	};
</script>

{#if type === 'standalone'}
	<div>
		<IconButton alt="Copy code" style="float:right"><Copy /></IconButton>
		<pre {style}><code>
				{@html hljs.highlight(content, { language: lang }).value}
	</code>
</pre>

		<footer>
			codeblock {lang}
		</footer>
	</div>
{:else}
	<code class="inline" on:click={copyContent} on:keydown={copyContent}>
		{@html hljs.highlight(content, { language: lang }).value}
		<Copy />
	</code>
{/if}

<style>
	div {
		outline: var(--border-width) dashed var(--accent);
		border-radius: var(--border-radius);
	}
	pre {
		padding: 0 16px;
	}
	footer {
		background-color: var(--accent-subtle);
		border-radius: 0 0 var(--border-radius) var(--border-radius);
		text-align: center;
		padding: 4px;
	}

	code {
		font-family: 'Courier New', Courier, monospace;
	}

	.inline {
		cursor: pointer;
		transition: background-color var(--transition);
		background-color: transparent;
		display: inline-flex;
	}

	.inline:hover {
		background-color: var(--accent-subtle);
		cursor: pointer;
	}

	.inline:active {
		background-color: var(--accent);
	}
</style>
