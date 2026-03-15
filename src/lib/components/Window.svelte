<script lang="ts">
  import type { Snippet } from "svelte";
  import { getContext } from "svelte";
  import { WindowManager, WM_CONTEXT_KEY } from "$lib/stores/windows.svelte";
  import IconMinimize from "$lib/icons/IconMinimize.svelte";
  import IconMaximize from "$lib/icons/IconMaximize.svelte";
  import IconRestore from "$lib/icons/IconRestore.svelte";
  import IconClose from "$lib/icons/IconClose.svelte";

  type Props = {
    id: string;
    title: string;
    icon?: string;
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
    minimized?: boolean;
    maximized?: boolean;
    resizable?: boolean;
    children: Snippet;
    menubar?: Snippet;
  };

  let {
    id,
    title,
    icon,
    x = $bindable(),
    y = $bindable(),
    width = $bindable(),
    height = $bindable(),
    zIndex,
    minimized = false,
    maximized = false,
    resizable = true,
    children,
    menubar,
  }: Props = $props();

  const wm = getContext<WindowManager>(WM_CONTEXT_KEY);

  // ── Drag state ──
  let dragging = $state(false);
  let dragOffX = 0;
  let dragOffY = 0;

  // ── Resize state ──
  let resizing = $state(false);
  let resizeDir = "";
  let resizeStartX = 0;
  let resizeStartY = 0;
  let resizeStartW = 0;
  let resizeStartH = 0;
  let resizeStartWinX = 0;
  let resizeStartWinY = 0;

  function onTitlePointerDown(e: PointerEvent) {
    if (maximized) return;
    // Don't start drag when clicking window control buttons
    if ((e.target as HTMLElement).closest(".titlebar-buttons")) return;
    dragging = true;
    dragOffX = e.clientX - x;
    dragOffY = e.clientY - y;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent) {
    if (dragging) {
      wm.move(id, e.clientX - dragOffX, e.clientY - dragOffY);
    }
    if (resizing) {
      const dx = e.clientX - resizeStartX;
      const dy = e.clientY - resizeStartY;

      let newW = resizeStartW;
      let newH = resizeStartH;
      let newX = resizeStartWinX;
      let newY = resizeStartWinY;

      if (resizeDir.includes("e")) newW = resizeStartW + dx;
      if (resizeDir.includes("s")) newH = resizeStartH + dy;
      if (resizeDir.includes("w")) {
        newW = resizeStartW - dx;
        newX = resizeStartWinX + dx;
      }
      if (resizeDir.includes("n")) {
        newH = resizeStartH - dy;
        newY = resizeStartWinY + dy;
      }

      if (newW >= 200 && newH >= 120) {
        wm.resize(id, newW, newH);
        wm.move(id, newX, newY);
      }
    }
  }

  function onPointerUp() {
    dragging = false;
    resizing = false;
  }

  function onResizePointerDown(e: PointerEvent, dir: string) {
    if (!resizable || maximized) return;
    e.stopPropagation();
    resizing = true;
    resizeDir = dir;
    resizeStartX = e.clientX;
    resizeStartY = e.clientY;
    resizeStartW = width;
    resizeStartH = height;
    resizeStartWinX = x;
    resizeStartWinY = y;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onFocus() {
    wm.focus(id);
  }

  function onMinimize() {
    wm.minimize(id);
  }

  function onToggleMaximize() {
    wm.toggleMaximize(id);
  }

  function onClose() {
    wm.close(id);
  }

  let isActive = $derived(wm.activeWindow?.id === id);
</script>

<svelte:window onpointermove={onPointerMove} onpointerup={onPointerUp} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="window"
  class:maximized
  class:inactive={!isActive}
  style="
		left: {maximized ? 0 : x}px;
		top: {maximized ? 0 : y}px;
		width: {maximized ? '100%' : `${width}px`};
		height: {maximized ? `calc(100% - var(--taskbar-height))` : `${height}px`};
		z-index: {zIndex};
	"
  onpointerdown={onFocus}
>
  <!-- Title Bar -->
  <div class="titlebar" onpointerdown={onTitlePointerDown}>
    <div class="titlebar-left">
      {#if icon}
        <span class="title-icon">{icon}</span>
      {/if}
      <span class="title-text">{title}</span>
    </div>
    <div class="titlebar-buttons">
      <button class="wbtn" onclick={onMinimize} title="Minimize">
        <IconMinimize />
      </button>
      <button
        class="wbtn"
        onclick={onToggleMaximize}
        title={maximized ? "Restore" : "Maximize"}
      >
        {#if maximized}
          <IconRestore />
        {:else}
          <IconMaximize />
        {/if}
      </button>
      <button class="wbtn close-btn" onclick={onClose} title="Close">
        <IconClose />
      </button>
    </div>
  </div>

  <!-- Menu Bar (optional snippet) -->
  {#if menubar}
    <div class="menubar">
      {@render menubar()}
    </div>
  {/if}

  <!-- Content area -->
  <div class="window-content">
    {@render children()}
  </div>

  <!-- Status Bar -->
  <div class="statusbar"></div>

  <!-- Resize handles -->
  {#if resizable && !maximized}
    <div
      class="resize-handle n"
      onpointerdown={(e) => onResizePointerDown(e, "n")}
    ></div>
    <div
      class="resize-handle s"
      onpointerdown={(e) => onResizePointerDown(e, "s")}
    ></div>
    <div
      class="resize-handle e"
      onpointerdown={(e) => onResizePointerDown(e, "e")}
    ></div>
    <div
      class="resize-handle w"
      onpointerdown={(e) => onResizePointerDown(e, "w")}
    ></div>
    <div
      class="resize-handle ne"
      onpointerdown={(e) => onResizePointerDown(e, "ne")}
    ></div>
    <div
      class="resize-handle nw"
      onpointerdown={(e) => onResizePointerDown(e, "nw")}
    ></div>
    <div
      class="resize-handle se"
      onpointerdown={(e) => onResizePointerDown(e, "se")}
    ></div>
    <div
      class="resize-handle sw"
      onpointerdown={(e) => onResizePointerDown(e, "sw")}
    ></div>
  {/if}
</div>

<style>
  .window {
    position: absolute;
    display: flex;
    flex-direction: column;
    min-width: 200px;
    min-height: 120px;
    box-shadow: var(--shadow-window);
    border: var(--border-width) solid var(--win-border);
    border-radius: var(--radius-lg) var(--radius-lg) var(--radius-md)
      var(--radius-md);
    overflow: hidden;
    background: var(--win-bg);
  }

  .window.maximized {
    border-radius: 0;
    border: none;
  }

  .window.inactive {
    box-shadow:
      0 0 0 1px var(--color-border-dark),
      0 2px 16px #00000044;
  }

  /* ── Title Bar ── */
  .titlebar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--win-titlebar);
    padding: var(--space-2) var(--space-3);
    cursor: default;
    min-height: var(--titlebar-height);
    touch-action: none;
    flex-shrink: 0;
  }

  .inactive .titlebar {
    background: var(--win-titlebar-inactive);
  }

  .titlebar-left {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    overflow: hidden;
  }

  .title-icon {
    font-size: var(--font-size-md);
    flex-shrink: 0;
  }

  .title-text {
    color: var(--win-titlebar-text);
    font-family: var(--font-mono);
    font-size: var(--font-size-base);
    letter-spacing: 0.03em;
    text-shadow: 0 1px 2px #00200180;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .inactive .title-text {
    color: var(--win-titlebar-text-inactive);
  }

  .titlebar-buttons {
    display: flex;
    gap: var(--space-1);
    flex-shrink: 0;
  }

  .wbtn {
    width: 20px;
    height: 18px;
    border: 1px solid var(--win-btn-border);
    background: var(--win-btn-bg);
    color: var(--win-btn-text);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border-radius: var(--radius-sm);
    transition: background 0.1s;
  }

  .wbtn:hover {
    background: var(--win-btn-hover);
  }

  .close-btn:hover {
    background: var(--win-btn-close-hover);
    color: white;
  }

  /* ── Menu Bar ── */
  .menubar {
    display: flex;
    background: var(--win-menubar);
    border-bottom: 1px solid var(--win-menubar-border);
    padding: var(--space-1) var(--space-2);
    min-height: var(--menubar-height);
    flex-shrink: 0;
  }

  /* ── Content ── */
  .window-content {
    flex: 1;
    overflow: auto;
    scrollbar-color: var(--win-btn-bg) transparent;
    scrollbar-width: 10px;
    background: var(--win-bg);
  }

  /* ── Status Bar ── */
  .statusbar {
    background: var(--win-statusbar);
    border-top: 1px solid var(--win-menubar-border);
    padding: var(--space-1) var(--space-3);
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
    min-height: 18px;
    flex-shrink: 0;
  }

  /* ── Resize Handles ── */
  .resize-handle {
    position: absolute;
  }

  .resize-handle.n {
    top: -3px;
    left: 6px;
    right: 6px;
    height: 6px;
    cursor: n-resize;
  }
  .resize-handle.s {
    bottom: -3px;
    left: 6px;
    right: 6px;
    height: 6px;
    cursor: s-resize;
  }
  .resize-handle.e {
    right: -3px;
    top: 6px;
    bottom: 6px;
    width: 6px;
    cursor: e-resize;
  }
  .resize-handle.w {
    left: -3px;
    top: 6px;
    bottom: 6px;
    width: 6px;
    cursor: w-resize;
  }
  .resize-handle.ne {
    top: -3px;
    right: -3px;
    width: 12px;
    height: 12px;
    cursor: ne-resize;
  }
  .resize-handle.nw {
    top: -3px;
    left: -3px;
    width: 12px;
    height: 12px;
    cursor: nw-resize;
  }
  .resize-handle.se {
    bottom: -3px;
    right: -3px;
    width: 12px;
    height: 12px;
    cursor: se-resize;
  }
  .resize-handle.sw {
    bottom: -3px;
    left: -3px;
    width: 12px;
    height: 12px;
    cursor: sw-resize;
  }
</style>
