<script lang="ts">
	import type { Sentence } from '../../resources/types';

	export let sentences: Sentence[];

	import { Table } from '@components';
</script>

<details>
	<summary>{sentences[0].text}</summary>
	<Table
		headers={['Word', 'Translation']}
		style="margin-top: 1rem"
		rows={sentences.map(({ text, translation }) => ({ values: [text, translation] }))}
	></Table>
</details>

<style>
	details {
		max-width: 100%;
	}
	summary:hover {
		background-color: var(--accent-subtle);
	}
	summary {
		margin: -1rem;
		padding: 1rem;
		cursor: pointer;
		transition: 0.3s ease background;
	}

	th {
		background-color: var(--bg-inverted);
		color: var(--foreground-inverted);
	}

	th,
	td {
		padding: 0.5rem;
	}
</style>
