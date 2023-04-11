<script lang="ts">
	import '../reset.css';
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	inject({ mode: dev ? 'development' : 'production' });
	import { isDesktop, isTablet, isLargeScreen } from '@stores';
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
	});
</script>

<svelte:head>
	<meta name="theme-color" content="#19483a" />
</svelte:head>

<slot />

<style>
	@import url('https://fonts.googleapis.com/css2?family=Source+Serif+Pro:ital,wght@0,200;0,400;0,600;1,200;1,400&display=swap');
	:global(body) {
		background-color: var(--bg-primary);
		font-family: 'Source Serif Pro', serif;
	}

	/* CSS Variables */
	:root {
		--bg-primary: #ececec;
		--accent: #19483a;
		--max-width: 1040px;
		--border-radius: 1rem;
	}
</style>
