<script lang="ts">
  import { getContext } from "svelte";
  import { WindowManager, WM_CONTEXT_KEY } from "$lib/stores/windows.svelte";

  const wm = getContext<WindowManager>(WM_CONTEXT_KEY);

  // ── Drag-to-reorder state ──
  let dragIndex: number | null = $state(null);
  let dragOverIndex: number | null = $state(null);

  function onTabClick(id: string) {
    const win = wm.windows.find((w) => w.id === id);
    if (win?.minimized) win.minimized = false;
    wm.focus(id);
  }

  function onCloseTab(e: Event, id: string) {
    e.stopPropagation();
    wm.close(id);
  }

  // ── Drag reorder (pointer events for touch) ──
  function onDragStart(e: DragEvent, index: number) {
    dragIndex = index;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
    }
  }

  function onDragOver(e: DragEvent, index: number) {
    e.preventDefault();
    dragOverIndex = index;
  }

  function onDragEnd() {
    if (
      dragIndex !== null &&
      dragOverIndex !== null &&
      dragIndex !== dragOverIndex
    ) {
      wm.reorderTabs(dragIndex, dragOverIndex);
    }
    dragIndex = null;
    dragOverIndex = null;
  }
</script>

<div class="tab-bar" role="tablist">
  {#each wm.windows as win, i (win.id)}
    {@const isActive = wm.activeWindow?.id === win.id}
    <button
      class="tab"
      class:active={isActive}
      class:drag-over={dragOverIndex === i}
      role="tab"
      aria-selected={isActive}
      draggable="true"
      onclick={() => onTabClick(win.id)}
      ondragstart={(e) => onDragStart(e, i)}
      ondragover={(e) => onDragOver(e, i)}
      ondragend={onDragEnd}
    >
      <span class="tab-title">{win.title}</span>
      <span
        class="tab-close"
        role="button"
        tabindex="0"
        onclick={(e) => onCloseTab(e, win.id)}
        onkeydown={(e) => {
          if (e.key === "Enter") onCloseTab(e, win.id);
        }}
        title="Close"
        aria-label="Close {win.title}"
      >
        &times;
      </span>
    </button>
  {/each}
</div>

<style>
  .tab-bar {
    display: flex;
    flex: 1;
    overflow-x: auto;
    scrollbar-width: none;
    gap: 0;
    align-items: flex-end;
    padding: var(--space-2) var(--space-2) 0;
  }

  .tab-bar::-webkit-scrollbar {
    display: none;
  }

  .tab {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-4);
    background: rgba(212, 245, 214, 0.08);
    border: 1px solid rgba(212, 245, 214, 0.12);
    border-bottom: none;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    color: var(--color-text-light);
    font-family: var(--font-mono);
    font-size: var(--font-size-sm);
    white-space: nowrap;
    flex-shrink: 0;
    min-width: 60px;
    max-width: 140px;
    height: 36px;
    position: relative;
    /* Retro tab shape: slight skew */
    transform: perspective(100px) rotateX(2deg);
    transform-origin: bottom;
    transition: background 0.15s;
    cursor: grab;
  }

  .tab:active {
    cursor: grabbing;
  }

  .tab.active {
    background: var(--win-bg);
    color: var(--color-text);
    border-color: var(--win-border);
    z-index: 1;
  }

  .tab.drag-over {
    background: rgba(212, 245, 214, 0.2);
  }

  .tab:hover:not(.active) {
    background: rgba(212, 245, 214, 0.15);
  }

  .tab-title {
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    min-width: 0;
  }

  .tab-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    background: none;
    border: none;
    color: inherit;
    font-size: 14px;
    line-height: 1;
    border-radius: var(--radius-sm);
    flex-shrink: 0;
    opacity: 0.5;
    padding: 0;
  }

  .tab-close:hover {
    opacity: 1;
    background: var(--color-error);
    color: white;
  }
</style>
