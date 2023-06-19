<script lang="ts">
	export let description: string = '';
	export let summary: string;
</script>

<details id={`details-${summary}`}>
	<summary>{summary}</summary>
	<p>
		{description}
		<!-- todo add close icon -->
	</p>
</details>

<style>
	details {
		display: inline;
		position: relative;
	}

	details[open] {
		border: var(--border-width) dashed var(--accent) var(--border-width) dashed var(--accent)
			var(--border-width) dashed var(--accent);
	}

	summary {
		list-style: none;
		background-color: var(--accent-subtle);
		cursor: pointer;
	}

	summary:hover,
	summary:focus-visible {
		outline: var(--border-width) solid var(--accent);
	}

	p {
		position: absolute;
		background-color: var(--bg-primary);
		padding: 1rem;
		border-radius: var(--border-radius);
		outline: var(--border-width) dashed var(--accent);
		min-width: 20rem;
		max-width: 30rem;
		max-height: 20rem;
		overflow-x: scroll;
		z-index: 1;
	}
	/* todo style absolute */
</style>
