<script lang="ts">
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	inject({ mode: dev ? 'development' : 'production' });
	import { isDesktop, isTablet, isLargeScreen, platform } from '@stores';
	import { onMount } from 'svelte';

	onMount(() => {
		const mqTablet = window.matchMedia('(min-width: 768px)');
		const mqDesktop = window.matchMedia('(min-width: 1024px)');
		const mqLargeScreen = window.matchMedia('(min-width: 1440px)');

		isTablet.set(mqTablet.matches);
		isDesktop.set(mqDesktop.matches);
		isLargeScreen.set(mqLargeScreen.matches);

		mqTablet.onchange = (e) => {
			isTablet.set(e.matches);
		};
		mqDesktop.onchange = (e) => {
			isDesktop.set(e.matches);
		};
		mqLargeScreen.onchange = (e) => {
			isLargeScreen.set(e.matches);
		};

		const ua = navigator.userAgent.toLowerCase();
		console.log(ua);

		if (ua.includes('windows')) {
			platform.set('Windows');
		} else if (ua.includes('macintosh') || ua.includes('mac os x')) {
			platform.set('Mac');
		} else if (ua.includes('linux')) {
			platform.set('Linux');
		} else if (ua.includes('ipad')) {
			platform.set('iPad');
		} else if (ua.includes('android')) {
			platform.set('Android');
		} else {
			return 'Unknown';
		}
	});
</script>

<svelte:head>
	<meta name="theme-color" content="#19483a" />
</svelte:head>

<slot />

<style>
	@import url('https://fonts.googleapis.com/css2?family=Source+Serif+Pro:ital,wght@0,200;0,400;0,600;1,200;1,400&display=swap');
	@import url('https://fonts.googleapis.com/css2?family=Wix+Madefor+Display&display=swap');

	:global(body) {
		background-color: var(--bg-primary);
		font-family: 'Source Serif Pro', serif;
		color: var(--foreground);
		accent-color: var(--accent);
	}

	:global(::selection) {
		background: var(--accent-subtle);
	}

	/* CSS Variables */
	:root {
		--bg-primary: #ececec;
		--accent: #19483a;
		--accent-subtle: #00725036;
		--foreground: #113228;
		--max-width: 1040px;
		--border-radius: 1rem;
		--border-width: 0.15rem;
		--transition: 0.2s ease;
	}

	/* CSS Reset
	http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
*/

	:global(
			html,
			body,
			div,
			span,
			applet,
			object,
			iframe,
			h1,
			h2,
			h3,
			h4,
			h5,
			h6,
			p,
			blockquote,
			pre,
			a,
			abbr,
			acronym,
			address,
			big,
			cite,
			code,
			del,
			dfn,
			em,
			img,
			ins,
			kbd,
			q,
			s,
			samp,
			small,
			strike,
			strong,
			sub,
			sup,
			tt,
			var,
			b,
			u,
			i,
			center,
			dl,
			dt,
			dd,
			ol,
			ul,
			li,
			fieldset,
			form,
			label,
			legend,
			table,
			caption,
			tbody,
			tfoot,
			thead,
			tr,
			th,
			td,
			article,
			aside,
			canvas,
			details,
			embed,
			figure,
			figcaption,
			footer,
			header,
			hgroup,
			menu,
			nav,
			output,
			ruby,
			section,
			summary,
			time,
			mark,
			audio,
			video
		) {
		margin: 0;
		padding: 0;
		border: 0;
		font-size: 100%;
		font: inherit;
		vertical-align: baseline;
		box-sizing: border-box;
	}
	/* HTML5 display-role reset for older browsers */
	:global(article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section) {
		display: block;
	}
	:global(body) {
		line-height: 1;
	}
	:global(ol, ul) {
		list-style: none;
	}
	:global(blockquote, q) {
		quotes: none;
	}
	:global(blockquote:before, blockquote:after, q:before, q:after) {
		content: '';
		content: none;
	}
	:global(table) {
		border-collapse: collapse;
		border-spacing: 0;
	}

	:global(a) {
		color: inherit;
		text-decoration: none;
	}
</style>
