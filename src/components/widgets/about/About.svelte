<script lang="ts">
	import { useWindowManager } from '../../OS/shared/windowManager.svelte.js';
	import { toggleSquiggles, useSquiggles } from '../../OS/shared/useSquiggles.svelte.js';

	import Content from '@components/content.svelte';
	import Button from '@components/OS/Button.svelte';
	import { resolve } from '$app/paths';
	import WebRings from './WebRings.svelte';
	import Buttons from './Buttons.svelte';

	const wm = $derived(useWindowManager());
	const squigglesEnabled = $derived(useSquiggles());

	function resetComputer() {
		wm.resetLayout();
		location.reload();
	}
</script>

<Content>
	<p>
		Hi! I'm leekeh, a web developer based in the Netherlands. I'm also an accessibility advocate and
		proponent of the open web.
	</p>

	<Buttons />
	<hr />
	<h3>My background</h3>
	<p>
		I have 5 years of experience in web development, working for different companies, always working
		on design systems, but also always working on other projects, be it user flows, internal tools,
		or even backend. I don't believe in picking one framework or language, and am always catching up
		on my knowledge. I prefer to keep the details of my job history private, but feel free to <a
			href="mailto:hello@leekeh.com">email me</a
		>
		or say hello on
		<a href="https://bsky.app/profile/leekeh.com" target="_blank" rel="noopener">Bluesky</a>, for
		example, if you'd like to know more.
	</p>
	<p>
		In a past life, I sold books, and I have a degree in literature. This background gives me a
		unique ability to write documentation and strengthens my communication skills. I'm one of the
		few developers that loves to write documentation. It also helps me to build bridges between
		technical and non-technical stakeholders. I love explaining deeply technical concepts in a way
		that is understandable for everyone.
	</p>
	<hr />
	<h3>This site</h3>
	<p>
		This site is an homage to the indie web, past and present. I wanted to break from the clean,
		corporate styles, making something that is just playful. It is built with Svelte and uses
		progressive enhancement, i.e. things should work for the most part without JavaScript. Icons are
		sourced from
		<a href="https://tabler.io/icons" target="_blank" rel="noopener">Tabler</a> and
		<a href="https://openmoji.org/" target="_blank" rel="noopener">OpenMoji</a>. Fonts used are
		<a href="https://github.com/cadsondemak/Chakra-Petch" target="_blank" rel="noopener"
			>Chakra Petch</a
		>
		for headings and actions, and
		<a href="https://github.com/andrew-paglinawan/QuicksandFamily" target="_blank" rel="noopener"
			>Quicksand</a
		>
		for the rest. To read about the development process, check out my
		<a href={resolve('/blog/hello-world')} rel="noopener">blog post</a>
		or go directly to the
		<a href="https://github.com/leekeh/homepage" target="_blank" rel="noopener">GitHub repository</a
		>.
	</p>
	<p>This site is still under active development. Let me know if you run into any issues!</p>

	<div style="display: flex; gap: var(--space-4); flex-wrap: wrap;">
		<Button class="squiggle-toggle" onclick={toggleSquiggles}>
			Turn squiggles {squigglesEnabled ? 'off' : 'on'}
		</Button>
		<Button onclick={resetComputer}>Reset computer</Button>
	</div>

	<hr />
	<h3>Web rings</h3>
	<WebRings />
</Content>

<style>
	@media (prefers-reduced-motion: reduce) {
		:global(.squiggle-toggle) {
			display: none;
		}
	}
</style>
