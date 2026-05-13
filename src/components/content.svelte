<div class="content">
  <slot />
</div>

<style>
  .content {
    padding: var(--space-6);
  }

  /* target any header inside content */
  .content :global(h1),
  .content :global(h2),
  .content :global(h3),
  .content :global(h4),
  .content :global(h5),
  .content :global(h6) {
    font-family: var(--font-serif);
  }

  .content :global(p) {
    margin-block: var(--space-4);
    font-family: var(--font-sans);
    font-size: inherit;
    line-height: inherit;
    max-width: 65ch;
  }

  .content :global(hr) {
    margin: var(--space-6) 0;
  }

  .content :global(a) {
    color: var(--color-link);
    text-decoration: underline;
    font-family: var(--font-sans);
  }
</style>
