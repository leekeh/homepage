# Project: Retro Desktop Personal Site

A progressively-enhanced personal website styled as a retro (Win95-esque) desktop, built with SvelteKit and Svelte 5.

## Stack

- **SvelteKit 2** + **Svelte 5** (runes, TypeScript strict)
- **Vite 7**, plain CSS (no preprocessor, no Tailwind)
- **`@sveltejs/adapter-static`** with prerendering + fallback routing
- Markdown content pipeline: `unified` + `remark-parse` + `remark-rehype` + `rehype-stringify`
- Blog metadata plugins: `reading-time` + custom `rehype-excerpt` plugin

## Architecture

**Shell & Windows**

- Unified `Shell.svelte` handles both desktop (>768px) and mobile (≤768px) via CSS media queries
- **Desktop**: draggable/resizable windows, desktop icons, taskbar with Start menu
- **Mobile**: full-screen tabs with app menu
- `Shell.svelte` reads widget components from the shared registry (no local component map)
- Widget components are lazy-loaded via async imports (Svelte async rendering enabled)

**State & Routing**

- Use svelte runes for reactive state management, do not rely on `let` or `$:` reactive statements
- `WindowManager` (class-based `$state` runes): window z-index, snap, minimize/maximize, localStorage persistence
- Provided via context (`Symbol` keys), not imports
- Widget source of truth is split between:
  - `widgets.config.ts` (widget definitions array)
  - `widgets.ts` (registry/query helpers)
- `beforeNavigate()` intercepts navigation → opens widget via `wm.open()`. This is automatic, global behavior.
- URL synced via `pushState()` when window focused
- Catch-all route prerender includes blog slugs

**Content, SEO & Syndication**

- Blog content is sourced from Markdown files in `src/content/blog/posts/*.md`
- Blog collection utilities live in `src/content/blog/index.ts` (frontmatter parsing, HTML rendering, categories, reading-time)
- Global SEO metadata (title, description, OG/Twitter/canonical) is generated in `src/routes/+layout.svelte`
- RSS feeds are prerendered at:
  - `/rss.xml` (all posts)
  - `/rss/[category].xml` (one feed per category)
- Webmention support is configured via `src/content/webmentions.ts` and `<link rel="webmention">`/`<link rel="pingback">` tags in layout head

**Progressive Enhancement**

- No-JS: routes render as static HTML; anchor links work
- JS hydration (2-second startup delay): WindowManager takes over; windows become draggable/interactive
- Hydration overlay (`js-hydrating` class) visible during SSR→hydration transition, hides automatically on mount
- Async rendering enabled in `svelte.config.js` to support lazy widget component loading in SSR/client
- "commandfor" attributes require recent browsers, polyfilled with javascript in `src/util/polyfills.ts` for unsupported browsers (e.g. older Safari)

## Conventions

**Svelte 5 Runes**

- `$state`, `$derived`, `$effect`; no legacy `let` or `$:`
- `$props`, `$bindable` for two-way props
- Snippets (`{#snippet}` / `{@render}`), not slots

**Events**

- Pointer events only (`onpointerdown`, `onpointermove`, `onpointerup`)
- `setPointerCapture` / `releasePointerCapture` for drag tracking
- Drag threshold: 5px to distinguish click from drag

**Composite menus and toolbars**

- Use `useRovingTabindex.svelte.ts` for roving tabindex patterns in Start menus, taskbars, and toolbar-like widgets.
- Keep the active item index in the Svelte component (`$state`) and render `tabindex` declaratively from that state.
- The attachment should own keyboard delegation and focus movement; avoid separate sync helpers like `syncTabindices` or MutationObserver-based tab stop repair.

**Styling**

- CSS custom properties in `global-styles.css`
- Scoped styles; minimal `:global()`
- Z-index: desktop(0), icons(1), windows(10+), taskbar(1000), start-menu(1001), overlay(2000)
- App icons are sourced from https://openmoji.org/library/
- Other icons may be sourced from https://tabler-icons.io/

**Typescript**

- Do not add return types for functions that can be inferred.

## File Structure

```
src/
  components/
    OS/
      Shell.svelte              # Unified desktop/mobile shell (CSS media queries)
      window/
        Window.svelte           # Draggable/resizable window
        MinimalWindow.svelte    # Minimal overlay variant
      desktop/
        DesktopIcon.svelte      # Desktop icon (draggable)
      mobile/
        AppMenuDialog.svelte    # Mobile app menu (popover)
    widgets/                    # ~6 widget components (About, Blog, Paint, etc.)
      widgets.config.ts         # Widget definitions array (single source of truth)
      widgets.ts                # Widget registry/query helpers
  content/
    blog/
      index.ts                  # Blog collection + query helpers
      rehype-excerpt.ts         # Excerpt extraction plugin
      posts/*.md                # Blog Markdown entries
    rss.ts                      # RSS XML generator helpers
    site.ts                     # Site URL/name/description config
    webmentions.ts              # Webmention endpoint + API helpers
  components/
    OS/
      windowManager.svelte.ts   # WindowManager class
  routes/
    +layout.svelte              # Layout, context, hydration overlay, routing
    +layout.ts                  # Prerender config
    +page.svelte                # Root page
    [...]
    [...path]/+page.svelte      # Catch-all
    [...path]/+page.ts          # Catch-all prerender entries (blog slugs)
    rss.xml/+server.ts          # Full blog RSS feed
    rss/[category].xml/+server.ts # Category-specific RSS feeds
```

## Maintenance Guide

**Update this file when:**

- Adding/removing significant components (Window types, widgets)
- Changing media query breakpoint (768px)
- Modifying routing or widget registry structure
- Changing hydration behavior or startup delay (currently 2 seconds)
- Adding/removing conventions or key architectural decisions
- Any meaningful implementation change that affects architecture, behavior, or workflow

**Key files to check after changes:**

- `src/components/OS/Shell.svelte` — component structure, imports, CSS breakpoints
- `src/components/widgets/widgets.config.ts` — widget definitions and defaults
- `src/components/widgets/widgets.ts` — widget route matching and lookups
- `src/routes/+layout.svelte` — routing, hydration overlay, context setup
- `src/components/OS/windowManager.svelte.ts` — WindowManager API and persistence logic
- `src/content/blog/index.ts` — blog collection parsing and query helpers
- `src/routes/rss.xml/+server.ts` — general RSS feed generation
- `src/routes/rss/[category].xml/+server.ts` — category feed generation
