<script lang="ts">
  import { getContext } from "svelte";
  import {
    WindowManager,
    WM_CONTEXT_KEY,
    NAVIGATE_KEY,
  } from "$lib/stores/windows.svelte";
  import { getAllWidgets, type WidgetDef } from "$lib/registry/widgets";

  type Props = {
    onclose: () => void;
  };

  let { onclose }: Props = $props();

  const navigate =
    getContext<(widgetId: string, data?: Record<string, unknown>) => void>(
      NAVIGATE_KEY,
    );
  const widgets = getAllWidgets();

  // ── Long-press for deeplink ──
  let longPressTimer: ReturnType<typeof setTimeout> | null = null;
  let showDeeplink: string | null = $state(null);

  function openWidget(widget: WidgetDef) {
    navigate(widget.id);
    onclose();
  }

  function onPointerDown(widget: WidgetDef) {
    longPressTimer = setTimeout(() => {
      showDeeplink = widget.route;
    }, 600);
  }

  function onPointerUp(widget: WidgetDef) {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
    if (!showDeeplink) {
      openWidget(widget);
    }
  }

  function onPointerCancel() {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  }

  function copyDeeplink() {
    if (showDeeplink && typeof navigator !== "undefined") {
      navigator.clipboard.writeText(window.location.origin + showDeeplink);
    }
    showDeeplink = null;
  }

  function dismissDeeplink() {
    showDeeplink = null;
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") onclose();
  }
</script>

<svelte:window onkeydown={onKeyDown} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="app-menu-backdrop" onclick={onclose}>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="app-menu" onclick={(e) => e.stopPropagation()}>
    <div class="app-menu-header">
      <span class="app-menu-title">Applications</span>
    </div>
    <div class="app-list">
      {#each widgets as widget}
        <button
          class="app-item"
          onpointerdown={() => onPointerDown(widget)}
          onpointerup={() => onPointerUp(widget)}
          onpointercancel={onPointerCancel}
        >
          <div class="app-icon">
            <widget.icon />
          </div>
          <span class="app-name">{widget.title}</span>
          <span class="app-route">{widget.route}</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Deeplink tooltip -->
  {#if showDeeplink}
    <!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
    <div class="deeplink-overlay" onclick={dismissDeeplink}>
      <!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
      <div class="deeplink-popup" onclick={(e) => e.stopPropagation()}>
        <p class="deeplink-url">{showDeeplink}</p>
        <button class="deeplink-copy" onclick={copyDeeplink}>Copy link</button>
      </div>
    </div>
  {/if}
</div>

<style>
  .app-menu-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: var(--z-overlay);
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
  }

  .app-menu {
    width: 280px;
    max-height: 100%;
    background: var(--win-bg);
    border-right: var(--border-width) solid var(--win-border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .app-menu-header {
    background: var(--win-titlebar);
    padding: var(--space-5) var(--space-6);
  }

  .app-menu-title {
    color: var(--win-titlebar-text);
    font-family: var(--font-mono);
    font-size: var(--font-size-lg);
    font-weight: 600;
    letter-spacing: 0.05em;
  }

  .app-list {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-3) 0;
  }

  .app-item {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    padding: var(--space-4) var(--space-6);
    background: none;
    border: none;
    width: 100%;
    text-align: left;
    color: var(--color-text);
    font-family: var(--font-mono);
    touch-action: none;
  }

  .app-item:active {
    background: var(--color-primary);
    color: var(--color-text-light);
  }

  .app-icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .app-icon :global(svg) {
    width: 20px;
    height: 20px;
  }

  .app-name {
    flex: 1;
    font-size: var(--font-size-md);
  }

  .app-route {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
  }

  .app-item:active .app-route {
    color: var(--color-text-light);
    opacity: 0.7;
  }

  /* Deeplink popup */
  .deeplink-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: calc(var(--z-overlay) + 1);
  }

  .deeplink-popup {
    background: var(--win-bg);
    border: var(--border-width) solid var(--win-border);
    border-radius: var(--radius-lg);
    padding: var(--space-6);
    text-align: center;
    box-shadow: var(--shadow-window);
  }

  .deeplink-url {
    font-family: var(--font-mono);
    font-size: var(--font-size-md);
    color: var(--color-text);
    margin-bottom: var(--space-5);
    word-break: break-all;
  }

  .deeplink-copy {
    padding: var(--space-3) var(--space-6);
    background: var(--color-primary);
    color: var(--color-text-light);
    border: 1px solid var(--color-primary-dark);
    border-radius: var(--radius-md);
    font-family: var(--font-mono);
    font-size: var(--font-size-base);
  }

  .deeplink-copy:active {
    background: var(--color-primary-dark);
  }
</style>
