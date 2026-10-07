<script lang="ts">
	import { resolvePath } from '@utils/resolve';
	import type { PathnameWithSearchOrHash } from '$app/types';

	type Item = {
		href: PathnameWithSearchOrHash;
		src: string;
		alt: string;
		/** Link tooltip text. Falls back to `alt` when omitted. */
		title?: string;
	};

	type Props = {
		items: Item[];
	};

	let { items }: Props = $props();
</script>

<!--
@component
Grid of square thumbnail links — a folder's photos, the treats diary, or
anything else that's a flat list of "click through to a detail page" tiles.
 -->

<ul class="grid">
	{#each items as item (item.href)}
		<li class="squiggle-border">
			<a
				href={resolvePath(item.href)}
				title={item.title ?? item.alt}
				aria-label={item.title ?? item.alt}
			>
				<img src={item.src} alt={item.alt} loading="lazy" width="480" height="480" />
			</a>
		</li>
	{/each}
</ul>

<style>
	.grid {
		list-style: none;
		margin: 0;
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
