<script lang="ts">
  import { getContext } from "svelte";
  import { WindowManager, WM_CONTEXT_KEY } from "$lib/stores/windows.svelte";
  import StartMenu from "./StartMenu.svelte";
  import IconStart from "$lib/icons/IconStart.svelte";

  const wm = getContext<WindowManager>(WM_CONTEXT_KEY);

  let startMenuOpen = $state(false);

  function toggleStartMenu() {
    startMenuOpen = !startMenuOpen;
  }

  function closeStartMenu() {
    startMenuOpen = false;
  }

  function focusWindow(id: string) {
    const win = wm.windows.find((w) => w.id === id);
    if (win?.minimized) {
      win.minimized = false;
    }
    wm.focus(id);
  }

  // Clock
  let time = $state("");

  $effect(() => {
    function updateClock() {
      const now = new Date();
      time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    updateClock();
    const interval = setInterval(updateClock, 30_000);
    return () => clearInterval(interval);
  });
</script>

<div class="taskbar">
  <!-- Start button -->
  <button
    class="start-button"
    class:active={startMenuOpen}
    onclick={toggleStartMenu}
  >
    <IconStart />
    <span>Start</span>
  </button>

  <!-- Divider -->
  <div class="divider"></div>

  <!-- Open windows -->
  <div class="window-buttons">
    {#each wm.windows as win (win.id)}
      {@const isActive = wm.activeWindow?.id === win.id && !win.minimized}
      <button
        class="window-button"
        class:active={isActive}
        class:minimized={win.minimized}
        onclick={() => focusWindow(win.id)}
        title={win.title}
      >
        <span class="window-button-text">{win.title}</span>
      </button>
    {/each}
  </div>

  <!-- Clock -->
  <div class="clock-area">
    <span class="clock">{time}</span>
  </div>

  <!-- Start menu -->
  {#if startMenuOpen}
    <StartMenu onclose={closeStartMenu} />
  {/if}
</div>

<style>
  .taskbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: var(--taskbar-height);
    background: linear-gradient(180deg, #1a4d1a 0%, #0d2e0d 100%);
    border-top: 1px solid var(--color-primary-light);
    display: flex;
    align-items: center;
    padding: 0 var(--space-2);
    gap: var(--space-1);
    z-index: var(--z-taskbar);
  }

  .start-button {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-4);
    background: var(--win-btn-bg);
    border: 1px solid var(--win-btn-border);
    border-radius: var(--radius-md);
    color: var(--color-text);
    font-family: var(--font-mono);
    font-size: var(--font-size-base);
    font-weight: 600;
    height: 28px;
    flex-shrink: 0;
  }

  .start-button :global(svg) {
    width: 16px;
    height: 16px;
  }

  .start-button:hover {
    background: var(--win-btn-hover);
  }

  .start-button.active {
    background: var(--color-primary);
    color: var(--color-text-light);
    box-shadow: var(--shadow-sunken);
  }

  .divider {
    width: 1px;
    height: 24px;
    background: var(--color-primary-light);
    opacity: 0.4;
    flex-shrink: 0;
  }

  .window-buttons {
    display: flex;
    flex: 1;
    gap: var(--space-1);
    overflow: hidden;
  }

  .window-button {
    display: flex;
    align-items: center;
    padding: var(--space-2) var(--space-4);
    background: rgba(212, 245, 214, 0.1);
    border: 1px solid rgba(212, 245, 214, 0.15);
    border-radius: var(--radius-md);
    color: var(--color-text-light);
    font-family: var(--font-mono);
    font-size: var(--font-size-sm);
    height: 26px;
    max-width: 160px;
    flex-shrink: 0;
    overflow: hidden;
  }

  .window-button:hover {
    background: rgba(212, 245, 214, 0.2);
  }

  .window-button.active {
    background: rgba(0, 84, 9, 0.6);
    border-color: var(--color-primary-light);
    box-shadow: var(--shadow-sunken);
  }

  .window-button.minimized {
    opacity: 0.6;
  }

  .window-button-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .clock-area {
    display: flex;
    align-items: center;
    padding: var(--space-2) var(--space-4);
    border-left: 1px solid rgba(212, 245, 214, 0.2);
    flex-shrink: 0;
  }

  .clock {
    color: var(--color-text-light);
    font-family: var(--font-mono);
    font-size: var(--font-size-sm);
    letter-spacing: 0.05em;
  }
</style>
