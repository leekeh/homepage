# Personal homepage

SvelteKit 2.? + Svelte 5 personal website, styled as a retro desktop environment.

## Local development

For basic development, you can run `pnpm dev`.
For integrated development, you need to first run `pnpm wrangler login`. Then you can run `pnpm build && pnpm wrangler dev`. This is local development connecting with the remote database.

## To do:

- chat box
- finish up web mentions
- open graph images / data / etc
- add nested folders to menu
- add terminal with some common commands (ls, neofetch, help)
- validate html
- add a way to change window size with keyboard
- add proper metadata: OG, rss,
- add lots of content!
  - uses page
- keyboard shortcuts for window managements, opening shortcuts
- spotlight
- context menu (right click)
- remove old vercel integration and move to cloudflare pages
- draggable taskbar items (desktop and mobile)
- allow dragging open tabs on desktop and mobile. Allow closing tabs on mobile
- associate multiple widgets on one url
- custom scrollbar
- wait for fonts / assets to load before closing startup animation
- regression testing/screenshot testing on prs
- swipe to switch between open widgets on mobile
- remove tabindex of desktop icons when fullscreen widget is open
- universal comment section: use github, bluesky, web mentions, etc. to allow commenting on posts and pages
- better 404 handling
- auto-close windows after 10 are open to protect RAM or something
- update document title on navigation

widgets:

- add undo/redo functionality on paint widget
- music player
- pictochat
- feed of liked posts
- aquarium
- context menu for paint
- blogroll

blog posts:

- please don't give AI access to your personal images
- implementing all the WAI-aria a11y patterns
- indie web spelunking
- web design styles
- developer learning design saga
