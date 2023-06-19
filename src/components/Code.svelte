<script lang="ts">
	export let style: string = '';
	import hljs from 'highlight.js/lib/common';
	import 'highlight.js/styles/stackoverflow-dark.css';
	export let lang: string;
	export let content: string;
</script>

<div>
	<pre {style}>
	<code>
		{@html hljs.highlight(content, { language: lang }).value}
	</code></pre>
	<footer>codeblock {lang}</footer>
</div>

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
</style>
