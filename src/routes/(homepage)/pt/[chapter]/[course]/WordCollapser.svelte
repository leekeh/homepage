<script lang="ts">
	import type { Case } from '../../resources/types';

	export let word: Case;

	import { Table } from '@components';
</script>

<details>
	<summary>{word.single.masc.word}</summary>
	<Table headers={['', 'Masculine', 'Feminine']} style="margin-top: 1rem">
		{#if word.single}
			<Table.Row>
				<Table.Row.Cell as="th">Single</Table.Row.Cell>
				<Table.Row.Cell>{word.single.masc.word}</Table.Row.Cell>
				<Table.Row.Cell>{word.single.fem.word}</Table.Row.Cell>
			</Table.Row>
		{/if}
		{#if word.plural}
			<Table.Row>
				<Table.Row.Cell as="th">Plural</Table.Row.Cell>
				<Table.Row.Cell>{word.plural.masc.word}</Table.Row.Cell>
				<Table.Row.Cell>{word.plural.fem.word}</Table.Row.Cell>
			</Table.Row>
		{/if}
	</Table>
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
