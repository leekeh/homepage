<script lang="ts">
  const categories = [
    {
      name: "Editor & Terminal",
      items: [
        { name: "VS Code", note: "with Copilot, of course" },
        { name: "Warp", note: "terminal" },
        { name: "Monaspace", note: "font family" },
      ],
    },
    {
      name: "Web Development",
      items: [
        { name: "SvelteKit", note: "this site is built with it" },
        { name: "TypeScript", note: "always" },
        { name: "Plain CSS", note: "custom properties, scoped styles" },
        { name: "Vite", note: "fast builds" },
      ],
    },
    {
      name: "Design",
      items: [
        { name: "Figma", note: "UI design" },
        { name: "Excalidraw", note: "sketching" },
      ],
    },
    {
      name: "Hardware",
      items: [
        { name: "MacBook Pro", note: "M-series" },
        { name: "Mechanical keyboard", note: "clicky" },
        { name: "Ultrawide monitor", note: '34"' },
      ],
    },
  ];
</script>

<div class="uses">
  <h1>/uses</h1>
  <p class="subtitle">Things I use for development and beyond.</p>

  {#each categories as category}
    <section>
      <h2>{category.name}</h2>
      <ul>
        {#each category.items as item}
          <li>
            <span class="item-name">{item.name}</span>
            {#if item.note}
              <span class="item-note">— {item.note}</span>
            {/if}
          </li>
        {/each}
      </ul>
    </section>
  {/each}
</div>

<style>
  .uses {
    padding: var(--space-6);
    font-family: var(--font-mono);
    height: 100%;
    overflow-y: auto;
  }

  h1 {
    font-size: var(--font-size-lg);
    color: var(--color-primary);
    font-family: var(--font-mono);
    margin-bottom: var(--space-2);
  }

  .subtitle {
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
    margin-bottom: var(--space-7);
  }

  section {
    margin-bottom: var(--space-7);
  }

  h2 {
    font-size: var(--font-size-md);
    color: var(--color-primary-dark);
    margin-bottom: var(--space-4);
    border-bottom: 1px solid var(--color-border);
    padding-bottom: var(--space-2);
  }

  ul {
    list-style: none;
  }

  li {
    padding: var(--space-2) 0;
    padding-left: var(--space-5);
    position: relative;
  }

  li::before {
    content: ">";
    position: absolute;
    left: 0;
    color: var(--color-primary);
  }

  .item-name {
    font-weight: 600;
  }

  .item-note {
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
  }
</style>
