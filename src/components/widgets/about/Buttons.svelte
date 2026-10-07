<script lang="ts">
	import bskyImg from './88x31/bsky.gif';
	import cssImg from './88x31/css.gif';
	import enhancedImg from './88x31/enhanced.gif';
	import pictochat from './88x31/pictochat.png';
	import html5Img from './88x31/html5.gif';
	import tangledImg from './88x31/tangled.gif';
	import fascistsImg from './88x31/fascists.png';
	import passionImg from './88x31/passion.png';
	import bobImg from './88x31/bob.gif';
	import rssImg from './88x31/rss.png';
	import { resolve } from '$app/paths';
</script>

<ul class="buttons">
	<li>
		<a href="https://bsky.app/profile/leekeh.com" target="_blank" rel="noopener">
			<img src={bskyImg} alt="Bluesky" /></a
		>
	</li>
	<li>
		<a href="https://tangled.org/leekeh.com" target="_blank" rel="noopener"
			><img src={tangledImg} alt="Tangled" /></a
		>
	</li>
	<li>
		<img src={cssImg} alt="Made with Cascading Style Sheets" />
	</li>
	<li><img src={enhancedImg} alt="Progressively enhanced" /></li>
	<li><img src={html5Img} alt="Hypertext Markup Language 5" /></li>
	<li><img src={fascistsImg} alt="This machine kills fascists" /></li>
	<li><img src={passionImg} alt="Graphic design is my passion" /></li>
	<li>
		<a href={resolve('/rss.xml')} rel="noopener" data-sveltekit-reload
			><img src={rssImg} alt="Implement RSS now!" /></a
		>
	</li>
	<li><img src={bobImg} alt="Powered by bob" /></li>
	<li><img src={pictochat} alt="I miss using pictochat" /></li>
</ul>

<style>
	.buttons {
		display: grid;
		grid-template-columns: repeat(4, auto);
		margin-top: var(--space-4);
		gap: var(--space-4);
		width: fit-content;
		list-style: none;
		img {
			image-rendering: pixelated;
			image-rendering: crisp-edges;
			image-rendering: -webkit-optimize-contrast;
		}
	}
	@container (width < 500px) {
		.buttons {
			display: flex;
			flex-wrap: wrap;
		}
	}
</style>
