<script lang="ts">
	import { resolve } from '$app/paths';
	import { treats, posterSrc } from './data';
</script>

<ul class="grid">
	{#each treats as treat (treat.imgId)}
		<li class="squiggle-border">
			<a href={resolve(`/treats/${treat.imgId}`)} title={treat.title}>
				<img src={posterSrc(treat.imgId)} alt={treat.title} loading="lazy" />
			</a>
		</li>
	{/each}
</ul>

<style>
	.grid {
		list-style: none;
		margin: 0;
		padding: var(--space-4);
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		gap: var(--space-3);
	}

	a {
		display: block;
		width: 100%;
		padding: 0;
		border: none;
		background: var(--color-bg-subtle);
		cursor: pointer;
		aspect-ratio: 1;
		overflow: hidden;
	}

	a:hover {
		background: var(--color-bg-hover);
	}

	a:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
</style>
