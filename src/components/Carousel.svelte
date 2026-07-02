<script lang="ts">
	import Button from './OS/Button.svelte';
	import { useJsSupport } from './OS/shared/useJsSupport.svelte';

	type Item = {
		label: string;
		alt?: string;
		url: string;
		type?: 'image' | 'video' | 'page';
		credit?: string;
	};

	type Props = {
		title: string;
		items: Item[];
	};

	const hasJsSupport = $derived(useJsSupport());

	let titleId = $props.id();
	let slidesId = `${titleId}-slides`;

	let { items = [], title }: Props = $props();
	let activeIndex = $state(0);

	function prev() {
		activeIndex = (activeIndex - 1 + items.length) % items.length;
	}

	function next() {
		activeIndex = (activeIndex + 1) % items.length;
	}
</script>

{#snippet slide(item: Item, index: number)}
	<div
		class="carousel-item"
		role="group"
		{...hasJsSupport
			? {
					'aria-roledescription': 'slide',
					'aria-label': `Slide ${index + 1} of ${items.length}: ${item.label}`,
					hidden: index !== activeIndex
				}
			: {}}
	>
		<div class="slide-media">
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			{#if item.type === 'page'}
				<iframe
					src={item.url}
					title={item.label}
					width="100%"
					height="400px"
					sandbox="allow-scripts allow-same-origin allow-forms"
					loading="lazy"
				></iframe>
			{:else if item.type === 'video'}
				<!-- svelte-ignore a11y_media_has_caption -->
				<video src={item.url} controls width="100%"></video>
			{:else}
				<img src={item.url} alt={item.alt ?? item.label} />
			{/if}
		</div>
		<p class="slide-caption">
			{item.label}
		</p>
		{#if item.credit}
			<p class="credit">
				Source:
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<a href={item.credit} target="_blank" rel="noopener noreferrer nofollow"> {item.credit}</a>
			</p>
		{/if}
	</div>
{/snippet}

<section
	aria-roledescription="carousel"
	class="squiggle-border container"
	aria-labelledby={titleId}
>
	<div class="header">
		<p class="title" id={titleId}>{title}</p>
		{#if hasJsSupport}
			<div class="controls" role="group" aria-label="Slide controls">
				<Button onclick={prev} aria-label="Previous slide">&#8249;</Button>
				<span class="counter" aria-hidden="true">{activeIndex + 1} / {items.length}</span>
				<Button onclick={next} aria-label="Next slide">&#8250;</Button>
			</div>
		{/if}
	</div>
	{#if hasJsSupport}
		<!--
		aria-live="polite": screen readers announce newly visible slide content.
		aria-atomic="false": only the changed slide is read, not the whole container.
	-->
		<div id={slidesId} class="carousel-slides" aria-live="polite" aria-atomic="false">
			{#each items as item, index (index)}
				{@render slide(item, index)}
			{/each}
		</div>
	{:else}
		{#each items as item, index (index)}
			{@render slide(item, index)}
		{/each}
	{/if}
</section>

<style>
	.container {
		border-radius: var(--radius-lg);
		padding: var(--space-4) var(--space-5);
		margin-block: var(--space-7);
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-4);
		gap: var(--space-4);
	}

	.controls {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		flex-shrink: 0;
	}

	.slide-media {
		width: 100%;
		overflow: hidden;
	}

	.slide-media img {
		width: 100%;
		aspect-ratio: 16 / 9;

		height: auto;
		display: block;
		object-fit: contain;
	}

	.slide-media iframe,
	.slide-media video {
		display: block;
		border: none;
	}

	.slide-caption {
		font-family: var(--font-mono) !important;
		font-size: var(--font-size-sm);
		text-align: center;
		padding-top: var(--space-3);
	}

	.credit {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs) !important;
		max-width: 100% !important;
		text-align: center;
		padding-top: var(--space-1);
		color: var(--color-fg-muted);
		font-style: italic;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		overflow: hidden;

		a {
			display: block;
			min-width: 0;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}
	}

	.title {
		font-family: var(--font-mono) !important;
		color: var(--color-fg-muted);
		padding: var(--space-1) var(--space-2);
		font-size: var(--font-size-md);
		margin: 0;
		text-align: center;
		font-style: italic;
	}
</style>
