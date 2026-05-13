<!-- polymorphic button component -->
<script lang="ts">
  import type { Snippet } from "svelte";
  import type {
    HTMLAnchorAttributes,
    HTMLButtonAttributes,
  } from "svelte/elements";

  type AnchorProps = HTMLAnchorAttributes & {
    href: string;
    children?: Snippet;
  };

  type ButtonProps = HTMLButtonAttributes & {
    href?: undefined;
    children?: Snippet;
  };

  type Props = AnchorProps | ButtonProps;

  let { children, href, ...rest }: Props = $props();
</script>

{#if href}
  <a class="button" {href} {...rest as HTMLAnchorAttributes}>
    {@render children?.()}
  </a>
{:else}
  <button class="button" {...rest as HTMLButtonAttributes}>
    {@render children?.()}
  </button>
{/if}

<style>
  .button {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    border: var(--border-width) solid var(--color-border);
  }

  .button:hover {
    background-color: var(--color-button-bg-hover);
  }

  .button:active {
    background-color: var(--color-button-bg-active);
  }
</style>
