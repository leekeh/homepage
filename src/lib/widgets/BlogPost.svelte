<script lang="ts">
  type Props = {
    slug?: string;
  };

  let { slug = "hello-world" }: Props = $props();

  // Sample post content — in the future this would come from a data source
  const posts: Record<
    string,
    { title: string; date: string; content: string }
  > = {
    "hello-world": {
      title: "Hello, World!",
      date: "2025-12-01",
      content: `Welcome to my new site! I've been working on this redesign for a while,
			and I'm excited to finally share it. The idea was to create something that feels
			like a retro operating system — draggable windows, a start menu, the whole vibe —
			while still being a fully functional, accessible website under the hood.\n\n
			Everything is built with SvelteKit and plain CSS. No UI frameworks. The windows
			are real DOM elements with pointer event handlers for dragging and resizing.
			The routing uses SvelteKit's prerendering for SEO, then intercepts navigation
			client-side to open widgets without full page reloads.\n\n
			More posts coming soon. Stay tuned!`,
    },
    "retro-ui": {
      title: "Building a Retro Desktop UI",
      date: "2026-01-15",
      content: `The main challenge of building a desktop metaphor for the web is making
			it actually usable. Windows that overlap need z-index management. Dragging and
			resizing need to work with both mouse and touch. And the whole thing needs to
			degrade gracefully when JavaScript is disabled.\n\n
			I ended up building a WindowManager class using Svelte 5 runes — reactive state
			without any store boilerplate. Each window tracks its position, size, z-index,
			and minimized/maximized state. The Desktop component renders all open windows,
			and the Taskbar shows which ones are active.`,
    },
    "accessibility-matters": {
      title: "Accessibility Still Matters",
      date: "2026-02-20",
      content: `Even on a site that's styled like a retro desktop, accessibility matters.
			Every route pre-renders to meaningful HTML. Screen readers can navigate the content.
			Keyboard users can tab through interactive elements.\n\n
			The retro aesthetic is fun, but it's a layer on top of solid, semantic markup —
			not a replacement for it.`,
    },
  };

  const post = $derived(posts[slug] ?? posts["hello-world"]);
</script>

<article class="blog-post">
  <header>
    <a class="back-link" href="/blog">&larr; Back to blog</a>
    <h1>{post.title}</h1>
    <time class="date">{post.date}</time>
  </header>
  <div class="body">
    {#each post.content.split("\n\n") as paragraph}
      <p>{paragraph.trim()}</p>
    {/each}
  </div>
</article>

<style>
  .blog-post {
    padding: var(--space-6);
    font-family: var(--font-mono);
    height: 100%;
    overflow-y: auto;
  }

  header {
    margin-bottom: var(--space-7);
  }

  .back-link {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    text-decoration: none;
    display: inline-block;
    margin-bottom: var(--space-4);
  }

  .back-link:hover {
    color: var(--color-primary);
  }

  h1 {
    font-size: var(--font-size-xl);
    color: var(--color-primary);
    font-family: var(--font-serif);
    margin-bottom: var(--space-3);
  }

  .date {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
  }

  .body p {
    line-height: 1.7;
    margin-bottom: var(--space-6);
    color: var(--color-text);
    font-size: var(--font-size-base);
  }
</style>
