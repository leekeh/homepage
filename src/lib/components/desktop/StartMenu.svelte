<script lang="ts">
  import { getContext } from "svelte";
  import {
    WindowManager,
    WM_CONTEXT_KEY,
    NAVIGATE_KEY,
  } from "$lib/stores/windows.svelte";
  import { getAllWidgets } from "$lib/registry/widgets";

  type Props = {
    onclose: () => void;
  };

  let { onclose }: Props = $props();

  const navigate =
    getContext<(widgetId: string, data?: Record<string, unknown>) => void>(
      NAVIGATE_KEY,
    );
  const widgets = getAllWidgets();

  function openWidget(widgetId: string) {
    navigate(widgetId);
    onclose();
  }

  function onClickOutside(e: PointerEvent) {
    // Close if clicking outside the menu
    const target = e.target as HTMLElement;
    if (!target.closest(".start-menu") && !target.closest(".start-button")) {
      onclose();
    }
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") onclose();
  }
</script>

<svelte:window onpointerdown={onClickOutside} onkeydown={onKeyDown} />

<div class="start-menu" role="menu">
  <div class="menu-sidebar">
    <span class="sidebar-text">lieke.dev</span>
  </div>
  <div class="menu-items">
    {#each widgets as widget}
      <button
        class="menu-item"
        role="menuitem"
        onclick={() => openWidget(widget.id)}
      >
        <div class="menu-icon">
          <widget.icon />
        </div>
        <span class="menu-label">{widget.title}</span>
      </button>
    {/each}
  </div>
</div>

<style>
  .start-menu {
    position: absolute;
    bottom: calc(var(--taskbar-height) + 2px);
    left: var(--space-2);
    min-width: 200px;
    background: var(--win-bg);
    border: var(--border-width) solid var(--win-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-window);
    display: flex;
    overflow: hidden;
    z-index: var(--z-start-menu);
  }

  .menu-sidebar {
    width: 28px;
    background: var(--win-titlebar);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: var(--space-4);
  }

  .sidebar-text {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: rotate(180deg);
    color: var(--win-titlebar-text);
    font-family: var(--font-mono);
    font-size: var(--font-size-md);
    font-weight: 600;
    letter-spacing: 0.1em;
  }

  .menu-items {
    flex: 1;
    padding: var(--space-2) 0;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    padding: var(--space-3) var(--space-5);
    background: none;
    border: none;
    width: 100%;
    text-align: left;
    color: var(--color-text);
    font-family: var(--font-mono);
    font-size: var(--font-size-base);
    border-radius: 0;
  }

  .menu-item:hover {
    background: var(--color-primary);
    color: var(--color-text-light);
  }

  .menu-icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .menu-icon :global(svg) {
    width: 16px;
    height: 16px;
  }

  .menu-item:hover .menu-icon {
    color: var(--color-text-light);
  }

  .menu-label {
    white-space: nowrap;
  }
</style>
