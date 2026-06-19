<script lang="ts">
	import { beforeNavigate, pushState } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onMount, setContext, type Snippet } from 'svelte';
	import { page } from '$app/stores';
	import {
		WindowManager,
		WM_CONTEXT_KEY,
		WINDOW_NAVIGATE_CONTEXT_KEY,
		type WindowNavigateFn
	} from './windowManager.svelte.js';
	import {
		getWidgetByRoute,
		getRouteForWindow,
		widgetNavigationData
	} from '../../widgets/widgets.js';
	import { applyPolyfills } from '../../../util/polyfills.js';
	import { enableJsSupport } from './useJsSupport.svelte.js';
	import { initializeSquiggles } from './useSquiggles.svelte.js';
	import { initializeTime } from './useTime.svelte.js';
	import { resolve } from '$app/paths';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	const wm = new WindowManager();
	setContext(WM_CONTEXT_KEY, wm);

	let stopClock: (() => void) | null = null;
	let mq: MediaQueryList | null = null;
	let ssrSeedDone = false;

	// ── Navigation state and handlers ──
	let suppressUrlSync = $state(false);

	/** Open a widget and update the URL */
	const openWidgetAndNavigate: WindowNavigateFn = (widgetId, data) => {
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
	};

	setContext(WINDOW_NAVIGATE_CONTEXT_KEY, openWidgetAndNavigate);

	// Expose navigation handlers via effect so they stay reactive
	$effect(() => {
		wm.suppressUrlSync = suppressUrlSync;
		wm.openWidgetAndNavigate = openWidgetAndNavigate;
	});

	function isNonHtmlPath(pathname: string) {
		const segment = pathname.split('/').at(-1) ?? '';
		const dot = segment.lastIndexOf('.');
		if (dot <= 0) return false;
		const ext = segment.slice(dot + 1).toLowerCase();
		return ext !== 'html' && ext !== 'htm';
	}

	beforeNavigate((navigation) => {
		if (!browser) return;
		// Don't intercept back/forward — onpopstate handles those
		if (navigation.type === 'popstate') return;
		const to = navigation.to?.url?.pathname;
		if (!to) return;

		if (isNonHtmlPath(to)) {
			navigation.cancel();
			window.location.href = navigation.to!.url.href;
			return;
		}

		const match = getWidgetByRoute(to);
		if (!match) return;
		navigation.cancel();
		openWidgetAndNavigate(match.widget.id, match.params);
	});

	/** Sync URL whenever any window is brought to the front */
	$effect(() => {
		wm.onFocusChange = (win) => {
			if (suppressUrlSync || typeof window === 'undefined') return;
			const route = getRouteForWindow(win.widgetId, win.data);
			if (window.location.pathname !== route) {
				pushState(resolve(route), {});
			}
		};
	});

	// Seed one route-matched window during SSR so initial HTML has proper window content.
	// Only run once to avoid infinite loops.
	$effect(() => {
		if (ssrSeedDone) return;
		const currentPath = $page.url.pathname;
		const match = getWidgetByRoute(currentPath);
		if (match) {
			wm.open(match.widget.id, match.params ? { data: match.params } : undefined);
		} else {
			wm.open('about');
		}
		ssrSeedDone = true;
	});

	// Initialize on mount (polyfills, time, media query setup)
	onMount(() => {
		applyPolyfills();
		enableJsSupport();
		initializeSquiggles();
		stopClock = initializeTime();

		mq = window.matchMedia('(max-width: 768px)');
		wm.isMobile = mq.matches;
		wm.desktopWidth = window.innerWidth;
		wm.desktopHeight = window.innerHeight;
		wm.constrainWindowsToViewport();
		wm.seedIconDefaults(widgetNavigationData);

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

		// Cleanup
		return () => {
			if (stopClock) stopClock();
		};
	});

	// Handle media query changes
	function onMediaChange(e: MediaQueryListEvent) {
		wm.isMobile = e.matches;
	}

	// Effect to attach media query listener
	$effect(() => {
		if (!mq) return;
		mq.addEventListener('change', onMediaChange);
		return () => {
			mq?.removeEventListener('change', onMediaChange);
		};
	});

	// Handle window resize
	function onresize() {
		wm.desktopWidth = window.innerWidth;
		wm.desktopHeight = window.innerHeight;
		wm.constrainWindowsToViewport();
	}

	// Handle popstate (browser back/forward)
	function onpopstate() {
		suppressUrlSync = true;
		const path = window.location.pathname;
		const m = getWidgetByRoute(path);
		if (m) {
			wm.open(m.widget.id, m.params ? { data: m.params } : undefined);
		}
		suppressUrlSync = false;
	}
</script>

<svelte:window {onresize} {onpopstate} />

{@render children()}
