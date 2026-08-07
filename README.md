# Personal homepage

SvelteKit 2.? + Svelte 5 personal website, styled as a retro desktop environment.

## Local development

For basic development, you can run `pnpm dev`.
For integrated development, you need to first run `pnpm wrangler login`. Then you can run `pnpm build && pnpm wrangler dev`. This is local development connecting with the remote database.

## Standard.site

Our blog records are synced to standard.site to be discoverable and indexed on the AT protocol. To do a manual sync, run `ATP_APP_PASSWORD='[APP PASSWORD (found in .env)]' pnpm standard:publish`

## To do:

- finish up web mentions
- add nested folders to menu
- validate html
- add a way to change window size with keyboard
- keyboard shortcuts for window managements, opening shortcuts
- spotlight
- context menu (right click)
- remove old vercel integration and move to cloudflare pages
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
- make the blog a txt or pdf file. maybe make it look like a pdf viewer, txt viewer etc.
- dark mode
- accessibility statement
- handle the overflowing issue of desktop icons
- implement max sizes for windows
- add tests!!

widgets:

- chat box
- pictochat
- add terminal with some common commands (ls, neofetch, help)
- paint improvements:
  - add undo/redo functionality on paint widget
  - context menu for paint
- music player
- feed of liked posts
- aquarium
- blogroll (as folder)
- uses
- fun images
- image viewer
- tamagotchi
- powerpoint
- trash can (show dead projects)
- liked posts feed

blog posts:

- please don't give AI access to your personal images
- implementing all the WAI-aria a11y patterns
- indie web spelunking
  - blogroll
  - web rings https://a11y-webring.club/
  - 88 x 31
  - neocities
  - web mention w3c
  - rss
  - neocities
  - guest book
- web design styles
- developer learning design saga
- Agents.md for a junior engineer
- AI wants to please you. Here's how you can make it push back dumb ideas.
- Things to do instead of doomscrolling: Freewriting, Reading Wikipedia, Puzzles, Staring at a wall
- I've removed all photos of myself online. Multiple times, colleagues have still fed my photos to AI, so I'm not sure it's all worth it anyways.
- squiggle effects
- image sources to use instead of AI: public.works, free image sources, hand-drawn, etc.
