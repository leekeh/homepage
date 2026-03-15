<script lang="ts">
  import { setContext, onMount } from "svelte";
  import { beforeNavigate } from "$app/navigation";
  import { browser } from "$app/environment";
  import favicon from "$lib/assets/favicon.svg";
  import "$lib/styles/variables.css";
  import "$lib/styles/reset.css";
  import {
    WindowManager,
    WM_CONTEXT_KEY,
    NAVIGATE_KEY,
  } from "$lib/stores/windows.svelte";
  import { getWidgetByRoute, getRouteForWindow } from "$lib/registry/widgets";
  import Desktop from "$lib/components/desktop/Desktop.svelte";
  import MobileShell from "$lib/components/mobile/MobileShell.svelte";
  import { pushState } from "$app/navigation";

  let { children } = $props();

  // ── Window Manager ──
  const wm = new WindowManager();
  setContext(WM_CONTEXT_KEY, wm);

  // ── Responsive: detect mobile ──
  let isMobile = $state(false);

  // Guard: don't push state during popstate handling or initial load
  let suppressUrlSync = false;

  /** Sync URL whenever any window is brought to the front */
  wm.onFocusChange = (win) => {
    if (suppressUrlSync || typeof window === "undefined") return;
    const route = getRouteForWindow(win.widgetId, win.data);
    if (window.location.pathname !== route) {
      pushState(route, {});
    }
  };

  /** Open a widget and update the URL */
  function openWidgetAndNavigate(
    widgetId: string,
    data?: Record<string, unknown>,
  ) {
    const overrides: Record<string, unknown> = {};
    if (data) {
      overrides.data = data;
      if (data.slug) {
        overrides.title = String(data.slug)
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
      }
    }
    // focus() inside open() will trigger onFocusChange → URL sync
    wm.open(widgetId, overrides);
  }

  // Expose openWidgetAndNavigate via context so Desktop/Mobile can use it
  setContext(NAVIGATE_KEY, openWidgetAndNavigate);

  onMount(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    isMobile = mq.matches;
    wm.isMobile = isMobile;
    wm.desktopWidth = window.innerWidth;
    wm.desktopHeight = window.innerHeight;

    function onMediaChange(e: MediaQueryListEvent) {
      isMobile = e.matches;
      wm.isMobile = e.matches;
    }
    mq.addEventListener("change", onMediaChange);

    function onResize() {
      wm.desktopWidth = window.innerWidth;
      wm.desktopHeight = window.innerHeight;
    }
    window.addEventListener("resize", onResize);

    // ── Restore saved layout or open widget for current route ──
    suppressUrlSync = true;
    const restored = wm.restoreLayout();

    const currentPath = window.location.pathname;
    const match = getWidgetByRoute(currentPath);

    if (restored) {
      // Layout restored — if current URL points to a specific widget, focus it
      if (match) {
        wm.open(
          match.widget.id,
          match.params ? { data: match.params } : undefined,
        );
      } else {
        // Focus the topmost window if any
        const active = wm.activeWindow;
        if (active) wm.focus(active.id);
      }
    } else {
      // No saved layout — open the widget matching the current route
      if (match) {
        wm.open(
          match.widget.id,
          match.params ? { data: match.params } : undefined,
        );
      } else {
        wm.open("about");
      }
    }
    suppressUrlSync = false;

    // ── Handle popstate (back/forward) ──
    function onPopState() {
      suppressUrlSync = true;
      const path = window.location.pathname;
      const m = getWidgetByRoute(path);
      if (m) {
        wm.open(m.widget.id, m.params ? { data: m.params } : undefined);
      }
      suppressUrlSync = false;
    }
    window.addEventListener("popstate", onPopState);

    return () => {
      mq.removeEventListener("change", onMediaChange);
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("resize", onResize);
    };
  });

  // ── Intercept SvelteKit navigation: open widgets instead ──
  beforeNavigate((navigation) => {
    if (!browser) return;
    const to = navigation.to?.url?.pathname;
    if (!to) return;

    const match = getWidgetByRoute(to);
    if (match) {
      navigation.cancel();
      openWidgetAndNavigate(match.widget.id, match.params);
    }
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    rel="preconnect"
    href="https://fonts.gstatic.com"
    crossorigin="anonymous"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,600;1,400&family=Azeret+Mono:wght@400;500;600&display=swap"
    rel="stylesheet"
  />
</svelte:head>

{#if isMobile}
  <MobileShell>
    {@render children()}
  </MobileShell>
{:else}
  <Desktop>
    {@render children()}
  </Desktop>
{/if}
