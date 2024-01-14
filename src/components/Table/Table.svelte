<script lang="ts">
	import Row from './Row.svelte';
	export let headers: string[] = [];
	export let rows: { values: any[]; href?: string }[] = [];
	export let title: string = '';
	export let style: string = '';
	import Cell from './Cell.svelte';
</script>

<div {style}>
	<table>
		{#if title}
			<caption>{title}</caption>
		{/if}

		{#if headers.length !== 0}
			<thead>
				<tr>
					{#each headers as header}
						<Cell as="th">{header}</Cell>
					{/each}
				</tr>
			</thead>
		{/if}
		<tbody>
			{#each rows as row}
				<Row href={row.href} children={row.values} />
			{/each}
			<slot />
		</tbody>
	</table>
</div>

<style>
	table {
		border-spacing: 0;
		overflow: hidden;
		width: 100%;
		font-family: 'Source Serif Pro', serif;
		border-radius: var(--border-radius);
	}
	thead,
	caption {
		background-color: var(--bg-inverted);
		color: var(--foreground-inverted);
	}
	caption {
		padding: 1rem;
	}
	div {
		width: 100%;
		max-height: 100%;
		overflow: auto;
		border-radius: var(--border-radius);
		outline: var(--border-width) solid var(--accent);
	}
</style>
