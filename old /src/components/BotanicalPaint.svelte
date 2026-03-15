<script>
  import { onMount } from 'svelte';

  // --- Window state ---
  let windowX = 60, windowY = 40;
  let dragging = false, dragOffX = 0, dragOffY = 0;
  let minimized = false, maximized = false;

  // --- Canvas ---
  let canvas, ctx;
  let canvasWidth = 520, canvasHeight = 360;

  // --- Tools ---
  const TOOLS = ['pencil', 'brush', 'eraser', 'fill', 'line', 'rect', 'ellipse', 'text', 'eyedropper'];
  let activeTool = 'pencil';
  let brushSize = 3;
  let isDrawing = false;
  let startX, startY;
  let snapshot; // for shape preview

  // --- Text tool ---
  let textInput = '';
  let textX = 0, textY = 0;
  let showTextBox = false;
  let textBoxEl;

  // --- Colors ---
  const PALETTE = [
    '#000000','#3a3a3a','#696969','#a8a8a8','#d4d4d4','#ffffff',
    '#005409','#1a7a1f','#2eab35','#5ccc63','#a8e6ac','#d4f5d6',
    '#003d04','#004d06','#007a0a','#00a30e','#00cc12','#33d936',
    '#8B4513','#6B3410','#a0522d','#cd853f','#deb887','#f5deb3',
    '#1a3300','#2d5500','#3d7000','#4e8c00','#6aad00','#8fcc1a',
    '#ffdd00','#ffa500','#ff6600','#cc3300','#990000','#660000',
    '#0a2e0a','#143314','#1e4d1e','#286628','#3d803d','#5ca35c',
    '#002244','#003366','#004488','#0055aa','#0077cc','#55aaee',
    '#4a0066','#660099','#8800cc','#aa00ff','#cc44ff','#ee99ff',
  ];

  let primaryColor = '#005409';
  let secondaryColor = '#d4f5d6';
  let mouseBtn = 0;

  // --- Status ---
  let mousePos = { x: 0, y: 0 };
  let canvasSize = `${canvasWidth}x${canvasHeight}`;

  onMount(() => {
    ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f5f9f0';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Decorative botanical watermark
    drawBotanicalWatermark();
  });

  function drawBotanicalWatermark() {
    ctx.save();
    ctx.globalAlpha = 0.07;
    ctx.strokeStyle = '#005409';
    ctx.lineWidth = 1.5;
    // Simple leaf silhouettes
    drawLeaf(ctx, 80, 80, 0.4);
    drawLeaf(ctx, 400, 260, 0.5);
    drawLeaf(ctx, 250, 150, 0.35);
    ctx.restore();
  }

  function drawLeaf(c, x, y, scale) {
    c.save();
    c.translate(x, y);
    c.scale(scale, scale);
    c.beginPath();
    c.moveTo(0, -80);
    c.bezierCurveTo(60, -60, 60, 60, 0, 80);
    c.bezierCurveTo(-60, 60, -60, -60, 0, -80);
    c.stroke();
    c.beginPath();
    c.moveTo(0, -80);
    c.lineTo(0, 80);
    c.stroke();
    for (let i = -3; i <= 3; i++) {
      c.beginPath();
      c.moveTo(0, i * 20);
      c.quadraticCurveTo(i > 0 ? 25 : -25, i * 20 - 10, i > 0 ? 40 : -40, i * 22);
      c.stroke();
    }
    c.restore();
  }

  // ---- Window drag ----
  function onTitleMousedown(e) {
    if (maximized) return;
    dragging = true;
    dragOffX = e.clientX - windowX;
    dragOffY = e.clientY - windowY;
  }
  function onWindowMousemove(e) {
    if (dragging) {
      windowX = e.clientX - dragOffX;
      windowY = e.clientY - dragOffY;
    }
  }
  function onWindowMouseup() { dragging = false; }

  // ---- Drawing ----
  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top)
    };
  }

  function getColor(btn) {
    return btn === 2 ? secondaryColor : primaryColor;
  }

  function canvasMousedown(e) {
    e.preventDefault();
    mouseBtn = e.button;
    const pos = getPos(e);
    const color = getColor(e.button);

    if (activeTool === 'text') {
      textX = pos.x; textY = pos.y;
      showTextBox = true;
      setTimeout(() => textBoxEl?.focus(), 50);
      return;
    }
    if (activeTool === 'eyedropper') {
      const px = ctx.getImageData(pos.x, pos.y, 1, 1).data;
      const hex = '#' + [px[0],px[1],px[2]].map(v=>v.toString(16).padStart(2,'0')).join('');
      if (e.button === 2) secondaryColor = hex;
      else primaryColor = hex;
      return;
    }
    if (activeTool === 'fill') {
      floodFill(pos.x, pos.y, color);
      return;
    }

    isDrawing = true;
    startX = pos.x; startY = pos.y;

    if (['line','rect','ellipse'].includes(activeTool)) {
      snapshot = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    }

    if (activeTool === 'pencil' || activeTool === 'brush' || activeTool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  }

  function canvasMousemove(e) {
    const pos = getPos(e);
    mousePos = pos;

    if (!isDrawing) return;
    const color = getColor(mouseBtn);

    if (activeTool === 'pencil') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (activeTool === 'brush') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize * 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (activeTool === 'eraser') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = brushSize * 4;
      ctx.lineCap = 'square';
      ctx.lineJoin = 'round';
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (activeTool === 'line') {
      ctx.putImageData(snapshot, 0, 0);
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.moveTo(startX, startY);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (activeTool === 'rect') {
      ctx.putImageData(snapshot, 0, 0);
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.fillStyle = e.shiftKey ? color : 'transparent';
      ctx.lineWidth = brushSize;
      ctx.strokeRect(startX, startY, pos.x - startX, pos.y - startY);
      if (e.shiftKey) ctx.fillRect(startX, startY, pos.x - startX, pos.y - startY);
    } else if (activeTool === 'ellipse') {
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

  function canvasMouseup(e) {
    isDrawing = false;
    ctx.globalCompositeOperation = 'source-over';
  }

  // ---- Flood fill ----
  function floodFill(x, y, fillColor) {
    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    const data = imageData.data;
    const idx = (y * canvasWidth + x) * 4;
    const target = [data[idx], data[idx+1], data[idx+2], data[idx+3]];
    const fill = hexToRgba(fillColor);
    if (colorsMatch(target, fill)) return;

    const stack = [[x, y]];
    while (stack.length) {
      const [cx, cy] = stack.pop();
      if (cx < 0 || cx >= canvasWidth || cy < 0 || cy >= canvasHeight) continue;
      const i = (cy * canvasWidth + cx) * 4;
      if (!colorsMatch([data[i],data[i+1],data[i+2],data[i+3]], target)) continue;
      data[i] = fill[0]; data[i+1] = fill[1]; data[i+2] = fill[2]; data[i+3] = fill[3];
      stack.push([cx+1,cy],[cx-1,cy],[cx,cy+1],[cx,cy-1]);
    }
    ctx.putImageData(imageData, 0, 0);
  }

  function hexToRgba(hex) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return [r, g, b, 255];
  }
  function colorsMatch(a, b) {
    return a[0]===b[0] && a[1]===b[1] && a[2]===b[2] && a[3]===b[3];
  }

  // ---- Text tool ----
  function commitText() {
    if (!textInput.trim()) { showTextBox = false; textInput = ''; return; }
    ctx.font = `${brushSize * 5 + 10}px 'Palatino Linotype', Georgia, serif`;
    ctx.fillStyle = primaryColor;
    ctx.fillText(textInput, textX, textY);
    showTextBox = false;
    textInput = '';
  }

  // ---- Canvas ops ----
  function clearCanvas() {
    ctx.fillStyle = secondaryColor || '#f5f9f0';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  function saveImage() {
    const link = document.createElement('a');
    link.download = 'botanical-painting.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  // ---- Tool icon paths (simple SVG) ----
  const toolIcons = {
    pencil:     'M3 17L14 6l3 3L6 20H3v-3z M14 6l3-3 3 3-3 3-3-3z',
    brush:      'M16 3c-1.5 1.5-3 5-3 7l3 3c2-0 5.5-1.5 7-3L16 3zM10 13l-7 7 3 1 7-7-3-1z',
    eraser:     'M20 20H7L3 16l10-10 7 7-3 3 3 4zM6.5 17.5l7-7',
    fill:       'M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15a1.49 1.49 0 0 0 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5z',
    line:       'M21 3L3 21M21 3h-6M21 3v6',
    rect:       'M3 3h18v18H3z',
    ellipse:    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z',
    text:       'M5 4v3h5.5v12h3V7H19V4H5z',
    eyedropper: 'M20.71 5.63l-2.34-2.34a1 1 0 0 0-1.41 0l-3.12 3.12-1.41-1.42-1.42 1.42 1.41 1.41-6.6 6.6A2 2 0 0 0 5 16v3h3a2 2 0 0 0 1.42-.59l6.6-6.6 1.41 1.42 1.42-1.42-1.42-1.41 3.12-3.12a1 1 0 0 0 .16-1.65z',
  };
</script>

<svelte:window
  on:mousemove={onWindowMousemove}
  on:mouseup={onWindowMouseup}
/>

<!-- Outer desktop -->
<div class="desktop">
  <!-- Window -->
  <div
    class="window"
    class:maximized
    style="left:{maximized ? 0 : windowX}px; top:{maximized ? 0 : windowY}px; width:{maximized ? '100%' : '720px'};"
    on:contextmenu|preventDefault
  >
    <!-- Title Bar -->
    <div class="titlebar" on:mousedown={onTitleMousedown}>
      <div class="titlebar-left">
        <span class="title-icon">🌿</span>
        <span class="title-text">Botanical Paint — untitled.png</span>
      </div>
      <div class="titlebar-buttons">
        <button class="wbtn min-btn" on:click={() => minimized = !minimized} title="Minimize">─</button>
        <button class="wbtn max-btn" on:click={() => maximized = !maximized} title="Maximize">{maximized ? '❐' : '□'}</button>
        <button class="wbtn close-btn" title="Close">✕</button>
      </div>
    </div>

    {#if !minimized}
      <!-- Menu Bar -->
      <div class="menubar">
        {#each ['File','Edit','View','Image','Colors','Help'] as item}
          <div class="menu-item">
            {#if item === 'File'}
              <span class="menu-label">{item}</span>
              <div class="dropdown">
                <button on:click={saveImage}>Save as PNG</button>
                <button on:click={clearCanvas}>New (Clear)</button>
              </div>
            {:else}
              <span class="menu-label">{item}</span>
            {/if}
          </div>
        {/each}
      </div>

      <!-- Main area: toolbar + canvas -->
      <div class="paint-body">
        <!-- Left Toolbar -->
        <div class="toolbar">
          {#each TOOLS as tool}
            <button
              class="tool-btn"
              class:active={activeTool === tool}
              title={tool.charAt(0).toUpperCase() + tool.slice(1)}
              on:click={() => activeTool = tool}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d={toolIcons[tool]}/>
              </svg>
            </button>
          {/each}

          <div class="divider"></div>

          <!-- Brush size -->
          <div class="size-label">Size</div>
          {#each [1,3,5,8] as s}
            <button
              class="size-btn"
              class:active={brushSize === s}
              on:click={() => brushSize = s}
              title="Size {s}"
            >
              <span class="dot" style="width:{s*2+4}px;height:{s*2+4}px;"></span>
            </button>
          {/each}

          <div class="divider"></div>

          <!-- Active colors swatch -->
          <div class="color-preview">
            <div class="swatch secondary" style="background:{secondaryColor};" title="Secondary (right-click)"></div>
            <div class="swatch primary" style="background:{primaryColor};" title="Primary (left-click)"></div>
          </div>
        </div>

        <!-- Canvas area -->
        <div class="canvas-wrap">
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <canvas
            bind:this={canvas}
            width={canvasWidth}
            height={canvasHeight}
            on:mousedown={canvasMousedown}
            on:mousemove={canvasMousemove}
            on:mouseup={canvasMouseup}
            on:mouseleave={canvasMouseup}
            on:contextmenu|preventDefault
            style="cursor:{activeTool === 'eyedropper' ? 'crosshair' : activeTool === 'fill' ? 'cell' : activeTool === 'text' ? 'text' : 'crosshair'};"
          ></canvas>

          <!-- Inline text input -->
          {#if showTextBox}
            <div class="text-overlay" style="left:{textX}px;top:{textY - 20}px;">
              <input
                bind:this={textBoxEl}
                bind:value={textInput}
                class="text-input"
                placeholder="Type here…"
                on:keydown={e => { if(e.key==='Enter') commitText(); if(e.key==='Escape'){showTextBox=false;textInput='';} }}
                on:blur={commitText}
              />
            </div>
          {/if}
        </div>
      </div>

      <!-- Color Palette -->
      <div class="palette-bar">
        <div class="palette-swatches">
          {#each PALETTE as c}
            <button
              class="palette-cell"
              style="background:{c};"
              title={c}
              on:click={() => primaryColor = c}
              on:contextmenu|preventDefault={() => secondaryColor = c}
            ></button>
          {/each}
        </div>
      </div>

      <!-- Status Bar -->
      <div class="statusbar">
        <span>🌿 For Help, click Help Topics on the Help Menu.</span>
        <span class="status-coords">{mousePos.x},{mousePos.y}</span>
        <span class="status-size">{canvasWidth}×{canvasHeight}</span>
      </div>
    {/if}
  </div>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,600;1,400&family=Azeret+Mono:wght@400;500&display=swap');

  :global(body) {
    margin: 0;
    background: #0d1f0e;
    font-family: 'Azeret Mono', monospace;
    font-size: 12px;
    user-select: none;
  }

  .desktop {
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse at 20% 80%, #0a2e0a88 0%, transparent 60%),
      radial-gradient(ellipse at 80% 20%, #1a3300aa 0%, transparent 60%),
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 40px,
        #0a1f0a22 40px,
        #0a1f0a22 41px
      ),
      #0d1f0e;
  }

  /* Window */
  .window {
    position: absolute;
    min-width: 580px;
    box-shadow:
      0 0 0 1px #003d04,
      0 4px 32px #00000088,
      0 0 60px #00540930;
    border: 2px solid #005409;
    border-radius: 4px 4px 2px 2px;
    overflow: hidden;
    background: #f0f5ee;
  }
  .window.maximized {
    border-radius: 0;
    border: none;
  }

  /* Title Bar */
  .titlebar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(90deg, #003d04 0%, #005409 50%, #007a0a 100%);
    padding: 4px 6px;
    cursor: default;
    min-height: 26px;
  }
  .titlebar-left {
    display: flex; align-items: center; gap: 6px;
  }
  .title-icon { font-size: 14px; }
  .title-text {
    color: #d4f5d6;
    font-family: 'Azeret Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.03em;
    text-shadow: 0 1px 2px #00200180;
  }
  .titlebar-buttons {
    display: flex; gap: 3px;
  }
  .wbtn {
    width: 18px; height: 16px;
    border: 1px solid #003d04;
    background: #d4f5d6;
    color: #003d04;
    font-size: 9px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    padding: 0;
    border-radius: 1px;
    font-family: monospace;
    line-height: 1;
    transition: background 0.1s;
  }
  .wbtn:hover { background: #a8e6ac; }
  .close-btn:hover { background: #cc3300; color: #fff; }

  /* Menu bar */
  .menubar {
    display: flex;
    background: #e8f0e4;
    border-bottom: 1px solid #b8d4b0;
    padding: 1px 4px;
  }
  .menu-item {
    position: relative;
  }
  .menu-label {
    display: block;
    padding: 3px 8px;
    cursor: pointer;
    color: #003d04;
    font-size: 12px;
    letter-spacing: 0.02em;
    border-radius: 2px;
  }
  .menu-label:hover { background: #005409; color: #d4f5d6; }
  .dropdown {
    display: none;
    position: absolute;
    top: 100%; left: 0;
    background: #f0f5ee;
    border: 1px solid #005409;
    min-width: 130px;
    z-index: 100;
    box-shadow: 2px 2px 8px #00000040;
  }
  .menu-item:hover .dropdown { display: block; }
  .dropdown button {
    display: block; width: 100%;
    padding: 5px 12px;
    background: none; border: none;
    text-align: left; cursor: pointer;
    color: #003d04; font-size: 12px;
    font-family: 'Azeret Mono', monospace;
  }
  .dropdown button:hover { background: #005409; color: #d4f5d6; }

  /* Paint body */
  .paint-body {
    display: flex;
    background: #c8d8c0;
    border-bottom: 1px solid #b8d4b0;
  }

  /* Toolbar */
  .toolbar {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1px;
    padding: 4px 3px;
    background: #dce8d4;
    border-right: 2px solid #b8d4b0;
    min-width: 38px;
  }
  .tool-btn {
    width: 28px; height: 28px;
    display: flex; align-items: center; justify-content: center;
    background: #e8f0e4;
    border: 1px solid #b8d4b0;
    border-radius: 3px;
    cursor: pointer;
    color: #003d04;
    transition: all 0.1s;
    padding: 0;
  }
  .tool-btn:hover { background: #a8e6ac; border-color: #005409; }
  .tool-btn.active {
    background: #005409;
    color: #d4f5d6;
    border-color: #003d04;
    box-shadow: inset 1px 1px 3px #00200180;
  }

  .divider {
    width: 22px; height: 1px;
    background: #b8d4b0;
    margin: 3px 0;
  }

  .size-label {
    font-size: 9px; color: #556655;
    letter-spacing: 0.05em;
    margin-top: 2px;
  }
  .size-btn {
    width: 28px; height: 22px;
    display: flex; align-items: center; justify-content: center;
    background: #e8f0e4;
    border: 1px solid #b8d4b0;
    border-radius: 2px;
    cursor: pointer;
    padding: 0;
  }
  .size-btn.active { background: #005409; border-color: #003d04; }
  .size-btn.active .dot { background: #d4f5d6 !important; }
  .dot {
    border-radius: 50%;
    background: #003d04;
    display: block;
  }

  .color-preview {
    position: relative;
    width: 28px; height: 28px;
    margin-top: 4px;
  }
  .swatch {
    position: absolute;
    width: 18px; height: 18px;
    border: 1px solid #003d04;
    border-radius: 2px;
    cursor: pointer;
  }
  .primary { bottom: 0; right: 0; z-index: 2; }
  .secondary { top: 0; left: 0; z-index: 1; }

  /* Canvas */
  .canvas-wrap {
    position: relative;
    overflow: auto;
    flex: 1;
    background: #9db89a;
    padding: 8px;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
  }
  canvas {
    display: block;
    background: #f5f9f0;
    border: 1px solid #007a0a;
    box-shadow:
      2px 2px 0 #003d04,
      0 0 20px #00540940;
    image-rendering: pixelated;
  }

  /* Text overlay */
  .text-overlay {
    position: absolute;
    pointer-events: none;
  }
  .text-input {
    pointer-events: all;
    background: rgba(245,249,240,0.9);
    border: 1px dashed #005409;
    color: #003d04;
    font-family: 'Spectral', serif;
    font-size: 14px;
    outline: none;
    padding: 2px 4px;
    min-width: 80px;
  }

  /* Palette */
  .palette-bar {
    background: #dce8d4;
    border-top: 2px solid #b8d4b0;
    border-bottom: 1px solid #b8d4b0;
    padding: 5px 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .palette-swatches {
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
    max-width: 100%;
  }
  .palette-cell {
    width: 16px; height: 16px;
    border: 1px solid #7a9a78;
    border-radius: 1px;
    cursor: pointer;
    padding: 0;
    transition: transform 0.1s, box-shadow 0.1s;
  }
  .palette-cell:hover {
    transform: scale(1.3);
    box-shadow: 0 0 0 1px #003d04;
    z-index: 1;
    position: relative;
  }

  /* Status bar */
  .statusbar {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 3px 8px;
    background: #e0eada;
    border-top: 1px solid #b8d4b0;
    color: #335533;
    font-size: 11px;
    font-family: 'Azeret Mono', monospace;
  }
  .statusbar span:first-child { flex: 1; }
  .status-coords, .status-size {
    border-left: 1px solid #b8d4b0;
    padding-left: 10px;
    color: #005409;
  }
</style>
