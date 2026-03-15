<script lang="ts">
  import type { Snippet } from "svelte";
  import { getContext } from "svelte";
  import { WindowManager, WM_CONTEXT_KEY } from "$lib/stores/windows.svelte";
  import { getWidgetById } from "$lib/registry/widgets";
  import TabBar from "./TabBar.svelte";
  import AppMenu from "./AppMenu.svelte";
  import IconMenu from "$lib/icons/IconMenu.svelte";

  type Props = {
    children?: Snippet;
  };

  let { children }: Props = $props();

  const wm = getContext<WindowManager>(WM_CONTEXT_KEY);

  let appMenuOpen = $state(false);

  // Load widget components
  let loadedComponents: Record<string, any> = $state({});

  async function ensureComponent(widgetId: string) {
    if (loadedComponents[widgetId]) return;
    const def = getWidgetById(widgetId);
    if (!def) return;
    const mod = await def.component();
    loadedComponents[widgetId] = mod.default;
  }

  $effect(() => {
    for (const win of wm.windows) {
      ensureComponent(win.widgetId);
    }
  });

  // Active window is the one with the highest zIndex
  let activeWin = $derived(wm.activeWindow);
  let ActiveComponent = $derived(
    activeWin ? loadedComponents[activeWin.widgetId] : null,
  );
</script>

<div class="mobile-shell">
  <!-- Header bar -->
  <div class="mobile-header">
    <button class="menu-btn" onclick={() => (appMenuOpen = true)} title="Apps">
      <IconMenu />
    </button>
    <TabBar />
  </div>

  <!-- Active widget content -->
  <div class="mobile-content">
    {#if ActiveComponent && activeWin}
      <ActiveComponent {...activeWin.data ?? {}} />
    {:else if children}
      {@render children()}
    {:else}
      <div class="empty-state">
        <p>Open an app from the menu</p>
      </div>
    {/if}
  </div>

  <!-- App menu overlay -->
  {#if appMenuOpen}
    <AppMenu onclose={() => (appMenuOpen = false)} />
  {/if}
</div>

<style>
  .mobile-shell {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    background: var(--desktop-bg);
  }

  .mobile-header {
    display: flex;
    align-items: stretch;
    background: linear-gradient(180deg, #1a4d1a 0%, #0d2e0d 100%);
    border-bottom: 1px solid var(--color-primary-light);
    z-index: var(--z-taskbar);
    flex-shrink: 0;
  }

  .menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    background: none;
    border: none;
    border-right: 1px solid rgba(212, 245, 214, 0.2);
    color: var(--color-text-light);
    flex-shrink: 0;
  }

  .menu-btn :global(svg) {
    width: 20px;
    height: 20px;
  }

  .menu-btn:active {
    background: rgba(212, 245, 214, 0.1);
  }

  .mobile-content {
    flex: 1;
    overflow: auto;
    background: var(--win-bg);
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--color-text-muted);
    font-family: var(--font-mono);
    font-size: var(--font-size-md);
  }
</style>
