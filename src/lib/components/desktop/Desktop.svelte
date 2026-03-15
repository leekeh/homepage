<script lang="ts">
  import type { Snippet } from "svelte";
  import { getContext } from "svelte";
  import {
    WindowManager,
    WM_CONTEXT_KEY,
    NAVIGATE_KEY,
  } from "$lib/stores/windows.svelte";
  import { getWidgetById, getAllWidgets } from "$lib/registry/widgets";
  import Window from "$lib/components/Window.svelte";
  import MinimalWindow from "$lib/components/MinimalWindow.svelte";
  import DesktopIcon from "./DesktopIcon.svelte";
  import Taskbar from "./Taskbar.svelte";

  type Props = {
    children?: Snippet;
  };

  let { children }: Props = $props();

  const wm = getContext<WindowManager>(WM_CONTEXT_KEY);
  const navigate =
    getContext<(widgetId: string, data?: Record<string, unknown>) => void>(
      NAVIGATE_KEY,
    );

  // Desktop icons: show a subset of widgets as shortcuts
  const desktopShortcuts = $derived(getAllWidgets().filter((w) => !w.minimal));

  // Seed default icon positions (effect can write to $state, $derived cannot)
  $effect(() => {
    wm.seedIconDefaults(desktopShortcuts);
  });

  // Icon positions with defaults
  const iconPositions = $derived(wm.getAllIconPositions(desktopShortcuts));

  function openWidget(widgetId: string) {
    navigate(widgetId);
  }

  // Resolve widget component lazily
  let loadedComponents: Record<string, any> = $state({});

  async function ensureComponent(widgetId: string) {
    if (loadedComponents[widgetId]) return;
    const def = getWidgetById(widgetId);
    if (!def) return;
    const mod = await def.component();
    loadedComponents[widgetId] = mod.default;
  }

  // Load components for any open windows
  $effect(() => {
    for (const win of wm.windows) {
      ensureComponent(win.widgetId);
    }
  });
</script>

<div class="desktop">
  <!-- Desktop icons -->
  <div class="desktop-icons">
    {#each desktopShortcuts as widget}
      {@const pos = iconPositions[widget.id]}
      <DesktopIcon
        label={widget.title}
        icon={widget.icon}
        onclick={() => openWidget(widget.id)}
        x={pos.x}
        y={pos.y}
        onmove={(nx, ny) => wm.moveIcon(widget.id, nx, ny)}
      />
    {/each}
  </div>

  <!-- Render open windows -->
  {#each wm.windows as win (win.id)}
    {#if !win.minimized}
      {@const WidgetComponent = loadedComponents[win.widgetId]}
      {#if win.minimal}
        <MinimalWindow
          id={win.id}
          bind:x={win.x}
          bind:y={win.y}
          width={win.width}
          height={win.height}
          zIndex={win.zIndex}
        >
          {#if WidgetComponent}
            <WidgetComponent {...win.data ?? {}} />
          {/if}
        </MinimalWindow>
      {:else}
        {@const def = getWidgetById(win.widgetId)}
        <Window
          id={win.id}
          title={win.title}
          bind:x={win.x}
          bind:y={win.y}
          bind:width={win.width}
          bind:height={win.height}
          zIndex={win.zIndex}
          minimized={win.minimized}
          maximized={win.maximized}
          resizable={def?.resizable ?? true}
        >
          {#if WidgetComponent}
            <WidgetComponent {...win.data ?? {}} />
          {/if}
        </Window>
      {/if}
    {/if}
  {/each}

  <!-- SSR content fallback (hidden when JS is active) -->
  {#if children}
    <div class="ssr-content">
      {@render children()}
    </div>
  {/if}

  <!-- Taskbar -->
  <Taskbar />
</div>

<style>
  .desktop {
    position: fixed;
    inset: 0;
    background: var(--desktop-pattern);
    overflow: hidden;
  }

  .desktop-icons {
    position: absolute;
    inset: 0;
    z-index: var(--z-desktop-icons);
    pointer-events: none;
  }

  .desktop-icons :global(.desktop-icon) {
    pointer-events: auto;
  }

  .ssr-content {
    display: none;
  }
</style>
