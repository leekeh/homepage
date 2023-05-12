<script lang="ts">
	export let style: string = '';
	export let options: { value: string | boolean; label: string }[];
	export let value: string;
	export let label: string;
	export let hint: string = '';

	const id = crypto.randomUUID();
</script>

<fieldset {style} aria-describedby={id}>
	<legend>
		{label}
	</legend>

	<div>
		{#each options as option}
			<label>
				<input bind:group={value} type="radio" value={option.value} required />
				{option.label}
			</label>
		{/each}
	</div>

	<span {id}>{hint}</span>
</fieldset>

<style>
	div {
		margin: 1rem 0;
		display: flex;
		gap: 1rem;
	}
	span {
		font-size: 1rem;
		display: block;
		opacity: 0.8;
	}

	input {
		width: 1.5rem;
		height: 1.5rem;
		cursor: pointer;
		border-radius: 100%;
		position: relative;
		appearance: none;
		margin: 0;
	}

	input::before {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		border: var(--border-width) solid var(--foreground);
		background-color: transparent;
		border-radius: 100%;
		transition: color var(--transition), background-color var(--transition);
	}

	input:checked::before {
		color: var(--accent);
		background-image: radial-gradient(
			circle at center,
			currentColor 50%,
			transparent 52%,
			transparent 0
		);
	}

	input:hover::before,
	input:focus-visible::before {
		color: var(--foreground);
		background-color: var(--accent-subtle);
	}

	input:focus-visible {
		outline: none;
	}

	input:focus-visible::before {
		outline: var(--border-width) solid var(--accent);
		outline-offset: var(--border-width);
	}

	label {
		cursor: pointer;
		font-size: inherit;
		line-height: inherit;
		display: inline-flex;
		gap: 0.5rem;
	}
</style>
