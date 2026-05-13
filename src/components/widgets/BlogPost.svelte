<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import type { BlogPost } from "../../content/blog";
  import { absoluteUrl } from "../../content/site";
  import { fetchWebmentions, type Webmention } from "../../content/webmentions";

  type Props = {
    slug?: string;
  };

  let { slug = "hello-world" }: Props = $props();

  const posts = $derived(($page.data.blogPosts ?? []) as BlogPost[]);
  const fallbackPost = $derived(posts[0]);
  const post = $derived(
    posts.find((entry: BlogPost) => entry.slug === slug) ?? fallbackPost,
  );

  let webmentions = $state<Webmention[]>([]);
  let webmentionsLoading = $state(false);

  onMount(async () => {
    webmentionsLoading = true;
    webmentions = await fetchWebmentions(absoluteUrl(`/blog/${post.slug}`));
    webmentionsLoading = false;
  });
</script>

<article class="blog-post h-entry">
  <header>
    <a class="back-link" href="/blog">&larr; Back to blog</a>
    <h1 class="p-name">{post.title}</h1>
    <a class="u-url" href={post.canonicalUrl}>{post.canonicalUrl}</a>
    <time class="date dt-published" datetime={post.date}
      >{post.date} • {post.readingTimeText}</time
    >
  </header>
  <div class="body e-content">
    {@html post.html}
  </div>

  <section class="webmentions">
    <h2>Mentions</h2>
    {#if webmentionsLoading}
      <p class="webmentions-empty">Loading mentions...</p>
    {:else if webmentions.length === 0}
      <p class="webmentions-empty">No mentions yet.</p>
    {:else}
      <ul>
        {#each webmentions as mention (mention.id)}
          <li>
            <a
              href={mention.authorUrl || mention.url || "#"}
              target="_blank"
              rel="noreferrer noopener"
            >
              {mention.authorName}
            </a>
            {#if mention.content}
              <p>{mention.content}</p>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  </section>
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

  .u-url {
    display: none;
  }

  .body :global(p) {
    line-height: 1.7;
    margin-bottom: var(--space-6);
    color: var(--color-text);
    font-size: var(--font-size-base);
  }

  .body :global(h2),
  .body :global(h3) {
    margin: var(--space-6) 0 var(--space-3);
    color: var(--color-primary);
    font-family: var(--font-serif);
  }

  .body :global(a) {
    color: var(--color-link);
  }

  .webmentions {
    margin-top: var(--space-7);
    padding-top: var(--space-6);
    border-top: 1px solid var(--color-border);
  }

  .webmentions h2 {
    font-size: var(--font-size-md);
    margin-bottom: var(--space-4);
  }

  .webmentions ul {
    list-style: none;
    display: grid;
    gap: var(--space-4);
    padding: 0;
  }

  .webmentions li {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-4);
    background: var(--color-surface-alt);
  }

  .webmentions li a {
    color: var(--color-primary);
    font-weight: 600;
    text-decoration: none;
  }

  .webmentions li p {
    margin-top: var(--space-3);
    color: var(--color-text-muted);
    line-height: 1.5;
  }

  .webmentions-empty {
    color: var(--color-text-muted);
  }
</style>
