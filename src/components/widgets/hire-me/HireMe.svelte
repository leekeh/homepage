<script lang="ts">
	import HeaderImage from './HeaderImage.svelte';
	import Summary from './Summary.svelte';
	import Recos from './Recos.svelte';
	import Button from '@components/OS/Button.svelte';
</script>

<svg viewBox="0 0 10 10" id="heart">
	<path d="M2,2 L4,4 L6,2" fill="none" stroke="black" stroke-width="4" stroke-linecap="round" />
</svg>

<div class="mobile-bg"></div>
<div class="inner">
	<HeaderImage />
	<Summary />
	<Recos />

	<section>
		<h3>Two truths and a lie</h3>
		<ul>
			<li>I've developed a native app</li>
			<li>I'm an open source contributor</li>
			<li>I've presented on a conference</li>
		</ul>
	</section>

	<section>
		<h3>A non-negotiable...</h3>
		<p>Accessibility. And that goes beyond WCAG compliance.</p>
	</section>

	<section>
		<h3>Experience</h3>
		<h4>Frontend engineer,</h4>
		<h4>Frontend engineer</h4>

		<h4>Also add certificates here</h4>
	</section>

	<section>
		<p
			style="padding: var(--space-4); background-color: var(--color-bg-highlight); font-style: italic;"
		>
			In a past life, I was a bookseller with a MA in literature. Maybe that's why I love
			documentation so much.
		</p>
	</section>

	<section><Button href="/contact">slide into DMs</Button></section>
</div>

<style>
	section {
		padding: var(--space-6);
	}
	#heart {
		display: none;
	}
	.inner {
		aspect-ratio: 9/16;
		isolation: isolate;
		font-family: var(--font-sans);
	}

	@media (max-width: 768px), print {
		.mobile-bg {
			background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><defs><path id='h' d='M2,2 L4,4 L6,2' fill='none' stroke='%23E1C8F9' stroke-width='4' stroke-linecap='round'/></defs><use href='%23h'/><use href='%23h' x='20'/><use href='%23h' x='10' y='20'/><use href='%23h' x='30' y='20'/></svg>");
			background-repeat: repeat;
			background-size: 40px 40px;
			z-index: -1;
			inset: 0;
			position: absolute;
		}
		.inner {
			margin: var(--space-4) auto;
			aspect-ratio: initial;
			position: relative;
			border-radius: var(--radius-lg);
			height: fit-content;
			max-width: 336px;
		}
	}
</style>
