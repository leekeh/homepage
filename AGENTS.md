# Project: Retro Desktop Personal Site

A personal website styled as a retro (Win95-esque) desktop, built with SvelteKit and Svelte 5.

## Stack

- **SvelteKit 2** with **Svelte 5** (runes mode) and **TypeScript** (strict)
- **Vite 7**, no CSS preprocessor, no Tailwind — plain CSS with custom properties
- **`@sveltejs/adapter-static`** — all pages prerendered, `fallback: '404.html'` for SPA routing
- No runtime dependencies — everything is a devDep
- No linter or test framework configured

## Architecture

### Desktop Shell

- Desktop mode (>768px): draggable/resizable windows on a desktop surface with icons and a taskbar
- Mobile mode (≤768px): full-screen single-widget view with tab bar
- Responsive switch via `matchMedia` in `+layout.svelte`

### State Management

- **`WindowManager`** class in `src/lib/stores/windows.svelte.ts` — class-based reactive store using `$state` runes, not Svelte stores
- Provided via **context** (`setContext`/`getContext` with `Symbol` keys), not imports
- Window + icon positions persisted to `localStorage` with debounced saves

### Widget System

- Widgets registered in `src/lib/registry/widgets.ts` via `registerWidget()` with lazy `() => import(...)` component loading
- Each widget maps to a route (e.g., `about` → `/`, `blog` → `/blog`, `blogpost` → `/blog/[slug]`)
- `getWidgetByRoute(path)` resolves parameterized routes

### Routing

- `+layout.svelte` intercepts SvelteKit navigation via `beforeNavigate()` and opens widgets instead
- URL synced via `pushState()` when a window is focused (`wm.onFocusChange` callback)
- Back/forward handled via `popstate` listener
- All routes have `<noscript>` content for progressive enhancement

## Svelte 5 Conventions

- **Runes only**: `$state`, `$derived`, `$props`, `$bindable`, `$effect` — no legacy `let` reactivity or `$:` statements
- **Snippets**, not slots: use `{#snippet}` / `{@render}` for component composition
- **Event attributes**, not directives: `onclick={handler}`, not `on:click={handler}`. No event modifiers (`|stopPropagation` etc.) — call methods on the event object instead
- **Never mutate `$state` inside `$derived`** — use `$effect` for side-effects that write to state
- **`$bindable()` props** for two-way binding (e.g., window x/y/width/height)

## Event Handling

- **Pointer Events exclusively** for all drag/resize interactions (`onpointerdown`, `onpointermove`, `onpointerup`) — never mouse events. This ensures touch + mouse compatibility.
- Use `setPointerCapture` / `releasePointerCapture` for reliable drag tracking
- Set `touch-action: none` and `user-select: none` on draggable elements
- Use a **drag threshold** (5px) to distinguish clicks from drags

## Styling

- **CSS custom properties** defined in `src/lib/styles/variables.css` — botanical green theme
- Scoped `<style>` blocks in components, use `:global()` sparingly
- Z-index layers: desktop(0) → icons(1) → windows(10+) → taskbar(1000) → start-menu(1001) → overlay(2000)
- Fonts: `--font-mono` (Azeret Mono), `--font-serif` (Spectral)

## Progressive Enhancement

- All routes must provide `<noscript>` fallback content with plain HTML/links
- The desktop/mobile shell only renders client-side
- Prerender everything (`export const prerender = true` in `+layout.ts`)

## File Structure

```
src/
  lib/
    components/
      Window.svelte          # Standard draggable/resizable window
      MinimalWindow.svelte    # Transparent overlay panel
      desktop/                # Desktop-mode components (Desktop, DesktopIcon, Taskbar, StartMenu)
      mobile/                 # Mobile-mode components (MobileShell, TabBar, AppMenu)
    icons/                    # SVG icon components (Icon*.svelte)
    registry/widgets.ts       # Widget definitions and route matching
    stores/windows.svelte.ts  # WindowManager class (reactive state)
    styles/                   # variables.css, reset.css
    widgets/                  # Widget content components (About, Blog, Paint, etc.)
  routes/
    +layout.svelte            # Shell orchestrator, routing, context setup
    +layout.ts                # Prerender config
    +page.svelte              # Home route with noscript fallback
    blog/                     # Blog routes
```
