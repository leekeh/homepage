<script lang="ts">
	import { setContext, onMount } from 'svelte';
	import { page } from '$app/stores';
	import { beforeNavigate } from '$app/navigation';
	import { browser } from '$app/environment';
	import {
		WindowManager,
		WM_CONTEXT_KEY,
		NAVIGATE_KEY
	} from '../components/OS/shared/windowManager.svelte.js';
	import { getWidgetByRoute, getRouteForWindow } from '../components/widgets/widgets';
	import { absoluteUrl, SITE_DESCRIPTION } from '../content/site';
	import { WEBMENTION_ENDPOINT, WEBMENTION_PINGBACK } from '../content/webmentions';
	import Shell from '../components/OS/Shell.svelte';
	import { pushState } from '$app/navigation';
	import { applyPolyfills } from '../util/polyfills';
	import {
		enableJsSupport,
		initializeJsSupport
	} from '../components/OS/shared/useJsSupport.svelte';
	import { initializeTime } from '@components/OS/shared/useTime.svelte.js';

	let { children, data } = $props();
	initializeJsSupport();
	initializeTime();

	// ── Window Manager ──
	const wm = new WindowManager();
	setContext(WM_CONTEXT_KEY, wm);

	let initialSeedDone = false;
	const currentPath = $derived($page.url.pathname);
	const currentMatch = $derived(getWidgetByRoute(currentPath));
	const pageTitle = $derived.by(() => {
		const rootTitle = 'leekeh';
		if (!currentMatch?.widget || currentMatch.widget.id === 'about') return rootTitle;
		const currentSlug = currentMatch.params?.slug;
		if (currentMatch.widget.id === 'blogpost' && currentSlug) {
			return data.blogPosts.find((post) => post.slug === currentSlug)?.title ?? 'Blog Post';
		}
		return `${currentMatch.widget.title} - ${rootTitle}`;
	});

	const currentPost = $derived.by(() => {
		const currentSlug = currentMatch?.params?.slug;
		if (currentMatch?.widget.id !== 'blogpost' || !currentSlug) {
			return undefined;
		}
		return data.blogPosts.find((post) => post.slug === currentSlug);
	});

	const seo = $derived.by(() => {
		if (currentPost) {
			return {
				title: `${currentPost.title} - leekeh`,
				description: currentPost.description,
				type: 'article',
				url: currentPost.canonicalUrl,
				image: currentPost.ogImage ? absoluteUrl(currentPost.ogImage) : undefined
			};
		}

		return {
			title: pageTitle,
			description: SITE_DESCRIPTION,
			type: 'website',
			url: absoluteUrl(currentPath),
			image: undefined
		};
	});

	// Seed one route-matched window during SSR so initial HTML has proper window content.
	$effect(() => {
		if (initialSeedDone) return;
		const match = getWidgetByRoute(currentPath);
		if (match) {
			wm.open(match.widget.id, match.params ? { data: match.params } : undefined);
		} else {
			wm.open('about');
		}
		initialSeedDone = true;
	});

	// Guard: don't push state during popstate handling or initial load
	let suppressUrlSync = false;

	/** Sync URL whenever any window is brought to the front */
	wm.onFocusChange = (win) => {
		if (suppressUrlSync || typeof window === 'undefined') return;
		const route = getRouteForWindow(win.widgetId, win.data);
		if (window.location.pathname !== route) {
			pushState(route, {});
		}
	};

	/** Open a widget and update the URL */
	function openWidgetAndNavigate(widgetId: string, data?: Record<string, unknown>) {
		const overrides: Record<string, unknown> = {};
		if (data) {
			overrides.data = data;
			if (data.slug) {
				overrides.title = String(data.slug)
					.replace(/-/g, ' ')
					.replace(/\b\w/g, (l) => l.toUpperCase());
			}
		}
		// focus() inside open() will trigger onFocusChange → URL sync
		wm.open(widgetId, overrides);
	}

	// Expose openWidgetAndNavigate via context so Desktop/Mobile can use it
	setContext(NAVIGATE_KEY, openWidgetAndNavigate);

	onMount(() => {
		applyPolyfills();
		enableJsSupport();
		const mq = window.matchMedia('(max-width: 768px)');
		wm.isMobile = mq.matches;
		wm.desktopWidth = window.innerWidth;
		wm.desktopHeight = window.innerHeight;
		wm.constrainWindowsToViewport();

		function onMediaChange(e: MediaQueryListEvent) {
			wm.isMobile = e.matches;
		}
		mq.addEventListener('change', onMediaChange);

		function onResize() {
			wm.desktopWidth = window.innerWidth;
			wm.desktopHeight = window.innerHeight;
			wm.constrainWindowsToViewport();
		}
		window.addEventListener('resize', onResize);

		// ── Restore saved layout or open widget for current route ──
		suppressUrlSync = true;
		const restored = wm.restoreLayout();

		const path = window.location.pathname;
		const match = getWidgetByRoute(path);

		if (restored) {
			// Layout restored — if current URL points to a specific widget, focus it
			if (match) {
				wm.open(match.widget.id, match.params ? { data: match.params } : undefined);
			} else {
				// Focus the topmost window if any
				const active = wm.activeWindow;
				if (active) wm.focus(active.id);
			}
		} else {
			// No saved layout — open the widget matching the current route
			if (match) {
				wm.open(match.widget.id, match.params ? { data: match.params } : undefined);
			} else {
				wm.open('about');
			}
		}
		suppressUrlSync = false;
		// ── Handle popstate (back/forward) ──
		function onPopState() {
			console.log('popstate', window.location.pathname);
			suppressUrlSync = true;
			const path = window.location.pathname;
			const m = getWidgetByRoute(path);
			if (m) {
				wm.open(m.widget.id, m.params ? { data: m.params } : undefined);
			}
			suppressUrlSync = false;
		}
		window.addEventListener('popstate', onPopState);

		return () => {
			mq.removeEventListener('change', onMediaChange);
			window.removeEventListener('popstate', onPopState);
			window.removeEventListener('resize', onResize);
		};
	});

	// ── Intercept SvelteKit navigation: open widgets instead ──
	beforeNavigate((navigation) => {
		if (!browser) return;
		const to = navigation.to?.url?.pathname;
		if (!to || to.endsWith('.xml')) return;
		const match = getWidgetByRoute(to);
		if (match) {
			navigation.cancel();
			openWidgetAndNavigate(match.widget.id, match.params);
		}
	});
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<link rel="canonical" href={seo.url} />
	<meta property="og:title" content={seo.title} />
	<meta property="og:description" content={seo.description} />
	<meta property="og:type" content={seo.type} />
	<meta property="og:url" content={seo.url} />
	{#if seo.image}
		<meta property="og:image" content={seo.image} />
	{/if}
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={seo.title} />
	<meta name="twitter:description" content={seo.description} />
	{#if seo.image}
		<meta name="twitter:image" content={seo.image} />
	{/if}
	<link rel="alternate" type="application/rss+xml" title="leekeh blog feed" href="/rss.xml" />
	{#if WEBMENTION_ENDPOINT}
		<link rel="webmention" href={WEBMENTION_ENDPOINT} />
	{/if}
	{#if WEBMENTION_PINGBACK}
		<link rel="pingback" href={WEBMENTION_PINGBACK} />
	{/if}
	<link rel="icon" type="image/x-icon" href="/favicon.ico" />
</svelte:head>

<Shell>
	{@render children()}
</Shell>

<style>
	:global {
		:root {
			/* Basic colors, used for mixing */
			/* Based on / inspired by A Dictionary of Color Combinations */
			--cinnamon-buff: oklch(84.709% 0.1227 71.346);
			--vinaceous-cinnamon: oklch(77.542% 0.11134 23.273);
			--ochraceous-salmon: oklch(74.581% 0.09105 56.871);
			--olive-buff: oklch(83.092% 0.10829 121.738);

			/*  Key decisions */
			--bg-gradient: linear-gradient(
				90deg,
				oklch(from var(--cinnamon-buff) calc(l - 0.1) calc(c + 0.02) h) 0%,
				oklch(from var(--vinaceous-cinnamon) calc(l - 0.1) calc(c + 0.02) h) 100%
			);

			/* stuff after this needs to be cleaned still */ /* UI Elements */
			--win-bg: oklch(from var(--olive-buff) calc(l + 1) calc(c - 0.08) h);
			--win-titlebar: var(--bg-gradient);
			--win-border: oklch(from var(--vinaceous-cinnamon) calc(l - 0.35) calc(c + 0.05) h);
			--shadow-window: 0 0 0 1px var(--win-border), 0 4px 32px #00000088, 0 0 60px #00540930;

			/* ── Desktop ── */
			--desktop-bg: #0d1f0e;
			--desktop-pattern:
				radial-gradient(ellipse at 20% 80%, #0a2e0a88 0%, transparent 60%),
				radial-gradient(ellipse at 80% 20%, #1a3300aa 0%, transparent 60%),
				repeating-linear-gradient(
					45deg,
					transparent,
					transparent 40px,
					#0a1f0a22 40px,
					#0a1f0a22 41px
				),
				#0d1f0e;

			/* ── Window chrome ── */
			--win-titlebar-inactive: linear-gradient(90deg, #3a5a3a 0%, #4a6a4a 50%, #5a7a5a 100%);
			--win-titlebar-text: #d4f5d6;
			--win-titlebar-text-inactive: #a0b8a0;

			--win-bg-alt: #e8f0e4;
			--win-inset: #dce8d4;
			--win-menubar: #e8f0e4;
			--win-menubar-border: #b8d4b0;

			/* ── Window control buttons ── */
			--win-btn-bg: #d4f5d6;
			--win-btn-border: #003d04;
			/* bg using ellipse gradient for a subtle circle */
			--win-btn-hover: radial-gradient(circle at center, #007a0a88 0%, transparent 80%);
			--win-btn-close-hover: radial-gradient(circle at center, #cc330088 0%, transparent 80%);
			--win-btn-text: #003d04;

			/* a swatch */

			/* ── Colors ── */
			--color-primary: #005409;
			--color-primary-dark: #003d04;
			--color-primary-light: #007a0a;
			--color-accent: #2eab35;
			--color-accent-light: #5ccc63;
			--color-surface: #f0f5ee;
			--color-surface-alt: #e8f0e4;
			--color-surface-raised: #dce8d4;
			--color-surface-sunken: #c8d8c0;
			--color-border: #b8d4b0;
			--color-border-dark: #7a9a78;
			--color-text: #003d04;
			--color-text-muted: #556655;
			--color-text-light: #d4f5d6;
			--color-text-inverse: #f0f5ee;
			--color-error: #cc3300;
			--color-link: #005409;
			--color-link-hover: #007a0a;

			/* ── Typography ── */
			--font-mono: 'Azeret Mono', 'Cascadia Code', 'Consolas', monospace;
			--font-sans: 'Sono', system-ui, sans-serif;
			--font-serif: 'Zen Old Mincho', Georgia, serif;
			--font-system: var(--font-mono);
			--font-size-xs: 0.75rem;
			--font-size-sm: 0.8rem;
			--font-size-base: 1rem;
			--font-size-md: 0.875rem;
			--font-size-lg: 1rem;
			--font-size-xl: 1.25rem;

			/* ── Spacing ── */
			--space-1: 2px;
			--space-2: 4px;
			--space-3: 6px;
			--space-4: 8px;
			--space-5: 12px;
			--space-6: 16px;
			--space-7: 24px;
			--space-8: 32px;

			/* ── Borders & Radius ── */
			--radius-sm: 1px;
			--radius-md: 2px;
			--radius-lg: 10px;
			--radius-round: 9999px;
			--border-width: 1px;

			/* ── Shadows (Win95-style bevels) ── */
			--shadow-raised: inset 1px 1px 0 #d4f5d6, inset -1px -1px 0 #003d04;
			--shadow-sunken: inset 1px 1px 0 #003d04, inset -1px -1px 0 #d4f5d6;

			/* ── Layout ── */
			--taskbar-height: 36px;
			--titlebar-height: 28px;
			--menubar-height: 24px;
			--mobile-tabbar-height: 44px;

			/* ── Z-index layers ── */
			--z-desktop: 0;
			--z-desktop-icons: 1;
			--z-windows-base: 10;
			--z-taskbar: 1000;
			--z-start-menu: 1001;
			--z-overlay: 2000;
		}

		*,
		*::before,
		*::after {
			box-sizing: border-box;
		}

		* {
			margin: 0;
			padding: 0;
		}

		html,
		body {
			height: 100%;
			overflow: hidden;
		}

		body {
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
		}

		img,
		svg {
			display: block;
			max-width: 100%;
		}

		button {
			font: inherit;
			color: inherit;
			cursor: pointer;
		}

		a {
			color: var(--color-link);
			text-decoration: none;
		}

		a:hover {
			color: var(--color-link-hover);
		}
	}
</style>
