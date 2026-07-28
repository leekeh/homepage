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
- App-wide UI preferences should live in `src/components/OS/shared/use*.svelte.ts` hooks and be initialized from `WindowProvider.svelte`.

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
- Reusable wrapper components should accept a `class` prop and concatenate it with local base classes so callers can style via composition.
- Z-index: desktop(0), icons(1), windows(10+), taskbar(1000), start-menu(1001), overlay(2000)
- App icons are sourced from https://openmoji.org/library/
- Other icons may be sourced from https://tabler-icons.io/

**Typescript**

- Do not add return types for functions that can be inferred.

## Testing

Two layers, both driven by real Chromium (Playwright):

- **Isolated widget / unit tests — Vitest.** Two projects in [vite.config.ts](vite.config.ts):
  - `client` (browser mode, Playwright-driven Chromium): renders a single component in isolation. Files: `*.svelte.test.ts`, colocated next to the component (e.g. [Palette.svelte.test.ts](src/components/widgets/paint/Palette.svelte.test.ts)). Use `render` from `vitest-browser-svelte` + locators from `@vitest/browser/context`.
  - `server` (Node): pure logic — route matching, data helpers, geometry, etc. Files: `*.test.ts` (e.g. [widgets.test.ts](src/components/widgets/widgets.test.ts)).
- **Global OS tests — Playwright E2E** in [e2e/](e2e/). Exercise the whole shell against the built app across three environments, one project per filename suffix:
  - `*.desktop.spec.ts` — desktop shell (> 768px)
  - `*.mobile.spec.ts` — mobile shell (≤ 768px, device emulation)
  - `*.nojs.spec.ts` — progressive enhancement with JavaScript disabled

Commands:

- `pnpm test` — everything (unit then E2E)
- `pnpm test:unit` / `pnpm test:unit:watch` — Vitest (all / watch)
- `pnpm test:unit:changed` — **affected only**: runs just the tests whose Vite module graph changed vs `origin/main`. Prefer this while iterating on a single widget.
- `pnpm test:e2e` / `pnpm test:e2e:ui` — Playwright OS tests

CI ([.github/workflows/test.yml](.github/workflows/test.yml)) runs on every PR: affected unit/widget tests (`vitest --changed`) + all three E2E projects.

**Always manage tests when you change code:**

- Changing a widget's behavior/logic → add or update its colocated `*.svelte.test.ts` (component) and/or `*.test.ts` (logic).
- Adding a widget → add a logic test for anything in `widgets.config.ts`/routing it touches, and a widget render test if it has interactive behavior.
- Changing shell, routing, window management, or progressive enhancement → update the relevant `e2e/*.spec.ts` (desktop/mobile/no-js).
- After any change, run `pnpm test:unit:changed` (fast, affected) and the relevant E2E project before considering the work done. Never delete or skip a test to make a change pass — fix the test or the code.

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
- Adding/removing test layers, projects, or scripts (keep the Testing section in sync)
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
