<script lang="ts">
  import type { Component } from "svelte";

  type Props = {
    label: string;
    icon: Component;
    onclick: () => void;
    x: number;
    y: number;
    onmove?: (x: number, y: number) => void;
  };

  let { label, icon: Icon, onclick, x, y, onmove }: Props = $props();

  let dragging = $state(false);
  let hasMoved = false;
  let offsetX = 0;
  let offsetY = 0;

  const DRAG_THRESHOLD = 5;
  let startX = 0;
  let startY = 0;

  function onPointerDown(e: PointerEvent) {
    if (e.button !== 0) return;
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    dragging = true;
    hasMoved = false;
    startX = e.clientX;
    startY = e.clientY;
    offsetX = e.clientX - x;
    offsetY = e.clientY - y;
  }

  const ICON_W = 80;
  const ICON_H = 100;
  const TASKBAR_H = 48;

  function onPointerMove(e: PointerEvent) {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (
      !hasMoved &&
      Math.abs(dx) < DRAG_THRESHOLD &&
      Math.abs(dy) < DRAG_THRESHOLD
    )
      return;
    hasMoved = true;
    const maxX = window.innerWidth - ICON_W;
    const maxY = window.innerHeight - ICON_H - TASKBAR_H;
    x = Math.max(0, Math.min(e.clientX - offsetX, maxX));
    y = Math.max(0, Math.min(e.clientY - offsetY, maxY));
  }

  function onPointerUp(e: PointerEvent) {
    if (!dragging) return;
    dragging = false;
    const el = e.currentTarget as HTMLElement;
    el.releasePointerCapture(e.pointerId);
    if (hasMoved) {
      onmove?.(x, y);
    } else {
      onclick();
    }
  }
</script>

<button
  class="desktop-icon"
  class:dragging
  style="left: {x}px; top: {y}px;"
  onpointerdown={onPointerDown}
  onpointermove={onPointerMove}
  onpointerup={onPointerUp}
>
  <div class="icon-image">
    <Icon />
  </div>
  <span class="icon-label">{label}</span>
</button>

<style>
  .desktop-icon {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    background: none;
    border: 1px solid transparent;
    border-radius: var(--radius-md);
    padding: var(--space-3);
    cursor: pointer;
    width: 80px;
    touch-action: none;
    user-select: none;
    transition:
      background 0.1s,
      border-color 0.1s;
  }

  .desktop-icon.dragging {
    opacity: 0.8;
    z-index: 9999;
  }

  .desktop-icon:hover {
    background: rgba(212, 245, 214, 0.1);
    border-color: rgba(212, 245, 214, 0.2);
  }

  .desktop-icon:active {
    background: rgba(212, 245, 214, 0.2);
  }

  .icon-image {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-light);
  }

  .icon-image :global(svg) {
    width: 32px;
    height: 32px;
  }

  .icon-label {
    color: var(--color-text-light);
    font-size: var(--font-size-sm);
    font-family: var(--font-mono);
    text-align: center;
    word-break: break-word;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
    line-height: 1.2;
  }
</style>
