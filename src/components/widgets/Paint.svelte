<script lang="ts">
  import { onMount } from "svelte";

  // ── Canvas state ──
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let canvasWidth = 480;
  let canvasHeight = 320;

  // ── Tools ──
  const TOOLS = [
    "pencil",
    "brush",
    "eraser",
    "fill",
    "line",
    "rect",
    "ellipse",
  ] as const;
  let activeTool = $state<string>("pencil");
  let brushSize = $state(3);
  let isDrawing = $state(false);
  let startX = 0;
  let startY = 0;
  let snapshot: ImageData | null = null;
  let mouseBtn = 0;

  // ── Colors ──
  const PALETTE = [
    "#000000",
    "#3a3a3a",
    "#696969",
    "#a8a8a8",
    "#ffffff",
    "#005409",
    "#1a7a1f",
    "#2eab35",
    "#5ccc63",
    "#a8e6ac",
    "#003d04",
    "#007a0a",
    "#00cc12",
    "#33d936",
    "#d4f5d6",
    "#8B4513",
    "#a0522d",
    "#cd853f",
    "#deb887",
    "#f5deb3",
    "#002244",
    "#004488",
    "#0077cc",
    "#55aaee",
    "#aaddff",
    "#660099",
    "#8800cc",
    "#cc44ff",
    "#ee99ff",
    "#ffdd00",
    "#ff6600",
    "#cc3300",
    "#990000",
    "#660000",
  ];

  let primaryColor = $state("#005409");
  let secondaryColor = $state("#d4f5d6");

  // ── Status ──
  let mousePos = $state({ x: 0, y: 0 });

  onMount(() => {
    ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#f5f9f0";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  });

  function getPos(e: MouseEvent): { x: number; y: number } {
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    };
  }

  function getColor(btn: number): string {
    return btn === 2 ? secondaryColor : primaryColor;
  }

  function onCanvasPointerDown(e: PointerEvent) {
    e.preventDefault();
    mouseBtn = e.button;
    const pos = getPos(e);
    const color = getColor(e.button);

    if (activeTool === "fill") {
      floodFill(pos.x, pos.y, color);
      return;
    }

    isDrawing = true;
    startX = pos.x;
    startY = pos.y;

    if (["line", "rect", "ellipse"].includes(activeTool)) {
      snapshot = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    }

    if (["pencil", "brush", "eraser"].includes(activeTool)) {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  }

  function onCanvasPointerMove(e: PointerEvent) {
    const pos = getPos(e);
    mousePos = pos;
    if (!isDrawing) return;
    const color = getColor(mouseBtn);

    if (activeTool === "pencil") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (activeTool === "brush") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize * 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (activeTool === "eraser") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = brushSize * 4;
      ctx.lineCap = "square";
      ctx.lineJoin = "round";
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (activeTool === "line" && snapshot) {
      ctx.putImageData(snapshot, 0, 0);
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.moveTo(startX, startY);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (activeTool === "rect" && snapshot) {
      ctx.putImageData(snapshot, 0, 0);
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.strokeRect(startX, startY, pos.x - startX, pos.y - startY);
    } else if (activeTool === "ellipse" && snapshot) {
      ctx.putImageData(snapshot, 0, 0);
      const rx = Math.abs(pos.x - startX) / 2;
      const ry = Math.abs(pos.y - startY) / 2;
      const cx = startX + (pos.x - startX) / 2;
      const cy = startY + (pos.y - startY) / 2;
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }

  function onCanvasPointerUp() {
    isDrawing = false;
    ctx.globalCompositeOperation = "source-over";
  }

  function floodFill(x: number, y: number, fillColor: string) {
    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    const data = imageData.data;
    const idx = (y * canvasWidth + x) * 4;
    const target = [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
    const fill = hexToRgba(fillColor);
    if (colorsMatch(target, fill)) return;

    const stack = [[x, y]];
    while (stack.length) {
      const [cx, cy] = stack.pop()!;
      if (cx < 0 || cx >= canvasWidth || cy < 0 || cy >= canvasHeight) continue;
      const i = (cy * canvasWidth + cx) * 4;
      if (
        !colorsMatch([data[i], data[i + 1], data[i + 2], data[i + 3]], target)
      )
        continue;
      data[i] = fill[0];
      data[i + 1] = fill[1];
      data[i + 2] = fill[2];
      data[i + 3] = fill[3];
      stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }
    ctx.putImageData(imageData, 0, 0);
  }

  function hexToRgba(hex: string): number[] {
    return [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16),
      255,
    ];
  }

  function colorsMatch(a: number[], b: number[]): boolean {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
  }

  function clearCanvas() {
    ctx.fillStyle = secondaryColor || "#f5f9f0";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  function saveImage() {
    const link = document.createElement("a");
    link.download = "painting.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }
</script>

<div class="paint">
  <div class="paint-body">
    <!-- Left Toolbar -->
    <div class="toolbar">
      {#each TOOLS as tool}
        <button
          class="tool-btn"
          class:active={activeTool === tool}
          title={tool.charAt(0).toUpperCase() + tool.slice(1)}
          onclick={() => (activeTool = tool)}
        >
          {tool.slice(0, 3)}
        </button>
      {/each}

      <div class="divider"></div>

      <div class="size-label">Size</div>
      {#each [1, 3, 5, 8] as s}
        <button
          class="size-btn"
          class:active={brushSize === s}
          onclick={() => (brushSize = s)}
        >
          <span class="dot" style="width:{s * 2 + 4}px;height:{s * 2 + 4}px;"
          ></span>
        </button>
      {/each}

      <div class="divider"></div>

      <div class="color-preview">
        <div
          class="swatch secondary"
          style="background:{secondaryColor};"
        ></div>
        <div class="swatch primary" style="background:{primaryColor};"></div>
      </div>
    </div>
    <noscript>
      Sorry, a lot of things work on this app without JavaScript, but the
      painting tool is unfortunately not one of them. If you want to play around
      with it, please enable JavaScript and reload the page.
    </noscript>

    <!-- Canvas -->
    <div class="canvas-wrap">
      <canvas
        bind:this={canvas}
        width={canvasWidth}
        height={canvasHeight}
        onpointerdown={onCanvasPointerDown}
        onpointermove={onCanvasPointerMove}
        onpointerup={onCanvasPointerUp}
        onpointerleave={onCanvasPointerUp}
        oncontextmenu={(e) => e.preventDefault()}
      ></canvas>
    </div>
  </div>

  <!-- Palette -->
  <div class="palette-bar">
    {#each PALETTE as c}
      <button
        class="palette-cell"
        style="background:{c};"
        title={c}
        onclick={() => (primaryColor = c)}
        oncontextmenu={(e) => {
          e.preventDefault();
          secondaryColor = c;
        }}
      ></button>
    {/each}
  </div>

  <!-- Status -->
  <div class="statusbar">
    <span>{mousePos.x},{mousePos.y}</span>
    <span>{canvasWidth}&times;{canvasHeight}</span>
    <button class="action-btn" onclick={clearCanvas}>Clear</button>
    <button class="action-btn" onclick={saveImage}>Save</button>
  </div>
</div>

<style>
  .paint {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .paint-body {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  /* Toolbar */
  .toolbar {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1px;
    padding: var(--space-2);
    background: var(--win-inset);
    border-right: 2px solid var(--win-menubar-border);
    min-width: 40px;
  }

  .tool-btn {
    width: 30px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--win-bg-alt);
    border: 1px solid var(--win-menubar-border);
    border-radius: var(--radius-md);
    color: var(--color-text);
    font-size: 8px;
    font-family: var(--font-mono);
    text-transform: uppercase;
    padding: 0;
  }

  .tool-btn:hover {
    background: var(--win-btn-hover);
    border-color: var(--color-primary);
  }

  .tool-btn.active {
    background: var(--color-primary);
    color: var(--color-text-light);
    border-color: var(--color-primary-dark);
    box-shadow: var(--shadow-sunken);
  }

  .divider {
    width: 22px;
    height: 1px;
    background: var(--win-menubar-border);
    margin: var(--space-2) 0;
  }

  .size-label {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
  }

  .size-btn {
    width: 28px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--win-bg-alt);
    border: 1px solid var(--win-menubar-border);
    border-radius: var(--radius-md);
    padding: 0;
  }

  .size-btn.active {
    background: var(--color-primary);
    border-color: var(--color-primary-dark);
  }

  .size-btn.active .dot {
    background: var(--color-text-light) !important;
  }

  .dot {
    border-radius: 50%;
    background: var(--color-primary-dark);
    display: block;
  }

  .color-preview {
    position: relative;
    width: 28px;
    height: 28px;
    margin-top: var(--space-2);
  }

  .swatch {
    position: absolute;
    width: 18px;
    height: 18px;
    border: 1px solid var(--color-primary-dark);
    border-radius: var(--radius-sm);
  }

  .primary {
    bottom: 0;
    right: 0;
    z-index: 2;
  }
  .secondary {
    top: 0;
    left: 0;
    z-index: 1;
  }

  /* Canvas */
  .canvas-wrap {
    flex: 1;
    overflow: auto;
    background: var(--color-surface-sunken);
    padding: var(--space-4);
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
  }

  canvas {
    display: block;
    background: #f5f9f0;
    border: 1px solid var(--color-primary-light);
    box-shadow: 2px 2px 0 var(--color-primary-dark);
    image-rendering: pixelated;
    touch-action: none;
  }

  /* Palette */
  .palette-bar {
    background: var(--win-inset);
    border-top: 2px solid var(--win-menubar-border);
    padding: var(--space-2) var(--space-4);
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
  }

  .palette-cell {
    width: 16px;
    height: 16px;
    border: 1px solid var(--color-border-dark);
    border-radius: var(--radius-sm);
    padding: 0;
    transition: transform 0.1s;
  }

  .palette-cell:hover {
    transform: scale(1.3);
    z-index: 1;
    position: relative;
  }

  /* Status */
  .statusbar {
    background: var(--win-statusbar);
    border-top: 1px solid var(--win-menubar-border);
    padding: var(--space-1) var(--space-4);
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
    display: flex;
    gap: var(--space-5);
    align-items: center;
  }

  .action-btn {
    font-size: var(--font-size-xs);
    padding: var(--space-1) var(--space-3);
    background: var(--win-bg-alt);
    border: 1px solid var(--win-menubar-border);
    border-radius: var(--radius-sm);
    color: var(--color-text);
  }

  .action-btn:hover {
    background: var(--win-btn-hover);
    border-color: var(--color-primary);
  }
</style>
