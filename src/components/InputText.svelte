<script lang="ts">
	export let value: any;
	export let style: string = '';
</script>

<input bind:value type="text" {style} />

<style>
	input {
		font-size: max(1.6rem, 2vw);
		padding: 0.5rem 1rem;
		border-radius: var(--border-radius);
		outline: var(--border-width) solid var(--accent);
		border: none;
		font: inherit;
		color: inherit;
	}
</style>
