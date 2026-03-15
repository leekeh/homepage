<script lang="ts">
  const posts = [
    {
      slug: "hello-world",
      title: "Hello, World!",
      date: "2025-12-01",
      excerpt:
        "First post on the new site. Talking about the redesign and what to expect.",
    },
    {
      slug: "retro-ui",
      title: "Building a Retro Desktop UI",
      date: "2026-01-15",
      excerpt:
        "How I built a Windows 95-inspired personal site with SvelteKit and CSS custom properties.",
    },
    {
      slug: "accessibility-matters",
      title: "Accessibility Still Matters",
      date: "2026-02-20",
      excerpt:
        "Why progressive enhancement and semantic HTML are still the foundation of good web development.",
    },
  ];
</script>

<div class="blog">
  <h1>Blog</h1>
  <div class="post-list">
    {#each posts as post}
      <a class="post-item" href="/blog/{post.slug}">
        <span class="post-date">{post.date}</span>
        <span class="post-title">{post.title}</span>
        <span class="post-excerpt">{post.excerpt}</span>
      </a>
    {/each}
  </div>
</div>

<style>
  .blog {
    padding: var(--space-6);
    font-family: var(--font-mono);
    height: 100%;
    overflow-y: auto;
  }

  h1 {
    font-size: var(--font-size-lg);
    color: var(--color-primary);
    margin-bottom: var(--space-6);
    font-family: var(--font-serif);
  }

  .post-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .post-item {
    display: grid;
    grid-template-columns: 90px 1fr;
    grid-template-rows: auto auto;
    gap: var(--space-1) var(--space-4);
    padding: var(--space-4) var(--space-3);
    border: 1px solid transparent;
    border-radius: var(--radius-md);
    text-decoration: none;
    color: var(--color-text);
  }

  .post-item:hover {
    background: var(--color-surface-alt);
    border-color: var(--color-border);
  }

  .post-date {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
    grid-row: 1;
    padding-top: 2px;
  }

  .post-title {
    font-size: var(--font-size-md);
    color: var(--color-primary);
    font-weight: 600;
    grid-column: 2;
    grid-row: 1;
  }

  .post-excerpt {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    grid-column: 2;
    grid-row: 2;
    line-height: 1.4;
  }
</style>
