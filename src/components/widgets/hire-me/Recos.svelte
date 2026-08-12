<script lang="ts">
	import Button from '@components/OS/Button.svelte';

	let listEl: HTMLDivElement | undefined = $state();

	function scroll(dir: -1 | 1) {
		if (!listEl) return;
		const card = listEl.querySelector<HTMLElement>('.slide');
		if (!card) return;
		const gap = parseFloat(getComputedStyle(listEl).gap) || 0;
		listEl.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: 'smooth' });
	}

	const recos = [
		{
			text: 'Her expertise, organization, and technical vision are invaluable assets for both me and the team.',
			who: 'Technical Lead',
			src: 'Thibault, end of year review 2025'
		},
		{
			text: 'She’s honestly one of the most reliable and thoughtful people I’ve worked with.',
			who: 'Design Manager',
			src: 'Sabrina on LinkedIn'
		},
		{
			text: 'Lieke delivers high-quality work with a remarkable level of technical precision.',
			who: 'Agile Project Manager',
			src: 'Adrien on LinkedIn'
		},

		{
			text: 'Lieke was my go-to whenever I needed to untangle something technical.',
			who: 'Senior UI Designer',
			src: 'Alan on LinkedIn'
		},

		{
			text: 'She is a critical person within the front-end community. She has loads of knowledge about frontend and design and that is shown in her work.',
			who: 'Staff Frontend Engineer',
			src: 'Trystian, end of year review 2025'
		},
		{
			text: 'She has a strong ability to translate intricate technical concepts into clear, actionable insights for all stakeholders.',
			who: 'Agile Project Manager',
			src: 'Adrien on LinkedIn'
		},
		{
			text: 'She is the dream engineering partner for any designer. Lieke is efficient, deeply trustworthy, and possesses a top-tier problem-solving mindset.',
			who: 'Senior Product Designer',
			src: 'Marie on LinkedIn'
		},
		{
			text: 'Working with her has been a great experience. I’ve noticed how proactive she is in our communication and the consistently high quality of her work.',
			who: 'Technical Lead',
			src: 'Axel Peter, end of year review 2025'
		}
	];
</script>

<section role="group" aria-roledescription="carousel" aria-labelledby="recos-heading">
	<div class="list-header">
		<h3 id="recos-heading">What others say:</h3>
	</div>
	<div class="nav">
		<Button iconOnly onclick={() => scroll(-1)} aria-label="Previous slide"
			><svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M15 6l-6 6l6 6" />
			</svg></Button
		>
		<Button iconOnly onclick={() => scroll(1)} aria-label="Next slide"
			><svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M9 6l6 6l-6 6" />
			</svg></Button
		>
	</div>
	<!--
		Scroll-snap viewport. tabindex="0" makes the overflow region keyboard-focusable
		(arrow keys scroll it) — required by WCAG 2.1.1 / axe scrollable-region-focusable.
		Svelte's a11y heuristic doesn't account for scroll containers, so we opt out here.
	-->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div class="slides" bind:this={listEl} tabindex="0" aria-label="What others say">
		{#each recos as reco, i (i)}
			<div
				class="slide"
				role="group"
				aria-roledescription="slide"
				aria-label={`${i + 1} of ${recos.length}`}
			>
				<blockquote>
					<p>{reco.text}</p>
					<footer>
						<cite>{reco.who}</cite>
					</footer>
				</blockquote>
			</div>
		{/each}
	</div>
</section>

<style>
	.list-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.nav {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	h3 {
		font-size: var(--font-size-sm);
		font-weight: 600;
	}
	section {
		padding: var(--space-6);
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.slides {
		display: flex;
		flex-direction: row;
		gap: var(--space-7);
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		::-webkit-scrollbar {
			display: none;
		}
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	.slide {
		scroll-snap-align: start;
		flex-shrink: 0;
	}

	blockquote {
		background-color: var(--color-bg-subtle);
		padding: var(--space-4);
		border-radius: var(--radius-lg);
		width: 30ch;
		overflow-wrap: break-word;
		p {
			display: -webkit-box;
			-webkit-line-clamp: 5;
			line-clamp: 5;
			-webkit-box-orient: vertical;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		footer {
			margin-top: var(--space-2);
			font-size: var(--font-size-sm);
			color: var(--color-text-secondary);
			font-style: italic;
		}
	}

	@media print {
		.nav {
			display: none;
		}
		.slides {
			flex-direction: column;
		}
	}
</style>
