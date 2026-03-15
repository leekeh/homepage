import { getWidgetById, type WidgetDef } from "$lib/registry/widgets";

export interface WindowState {
  id: string;
  widgetId: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  minimal: boolean;
  data?: Record<string, unknown>;
}

export interface IconPosition {
  x: number;
  y: number;
}

const STORAGE_KEY = "desktop-layout";

interface SavedLayout {
  windows: Array<{
    widgetId: string;
    title: string;
    x: number;
    y: number;
    width: number;
    height: number;
    minimized: boolean;
    maximized: boolean;
    data?: Record<string, unknown>;
  }>;
  iconPositions: Record<string, IconPosition>;
}

let nextId = 0;

function createId(): string {
  return `win-${nextId++}`;
}

export class WindowManager {
  windows: WindowState[] = $state([]);
  topZ: number = $state(10);
  isMobile: boolean = $state(false);
  iconPositions: Record<string, IconPosition> = $state({});
  desktopWidth: number = $state(1920);
  desktopHeight: number = $state(1080);

  /** Taskbar height to reserve at bottom */
  static readonly TASKBAR_H = 48;
  /** Called whenever a window is brought to the front. Set by the layout. */
  onFocusChange?: (win: WindowState) => void;

  get visibleWindows(): WindowState[] {
    return this.windows.filter((w) => !w.minimized);
  }

  get minimizedWindows(): WindowState[] {
    return this.windows.filter((w) => w.minimized);
  }

  get activeWindow(): WindowState | undefined {
    if (this.windows.length === 0) return undefined;
    return this.visibleWindows.reduce(
      (top, w) => (w.zIndex > (top?.zIndex ?? -1) ? w : top),
      undefined as WindowState | undefined,
    );
  }

  /** Open a widget. If already open, focuses it instead. Returns the window id. */
  open(widgetId: string, overrides?: Partial<WindowState>): string {
    // For widgets with data (like blog posts), match on widgetId + data
    const existing = this.windows.find((w) => {
      if (w.widgetId !== widgetId) return false;
      // If overrides have data, match on it too (e.g. same blog post slug)
      if (overrides?.data && w.data) {
        return JSON.stringify(w.data) === JSON.stringify(overrides.data);
      }
      // If no data, match on widgetId alone
      return !overrides?.data;
    });
    if (existing) {
      this.focus(existing.id);
      if (existing.minimized) {
        existing.minimized = false;
      }
      return existing.id;
    }

    const def = getWidgetById(widgetId);
    if (!def) return "";

    this.topZ++;
    const id = createId();
    const win: WindowState = {
      id,
      widgetId,
      title: overrides?.title ?? def.title,
      x:
        overrides?.x ??
        def.defaultX ??
        100 + ((this.windows.length * 30) % 200),
      y:
        overrides?.y ?? def.defaultY ?? 60 + ((this.windows.length * 30) % 150),
      width: overrides?.width ?? def.defaultWidth,
      height: overrides?.height ?? def.defaultHeight,
      zIndex: this.topZ,
      minimized: overrides?.minimized ?? false,
      maximized: overrides?.maximized ?? false,
      minimal: overrides?.minimal ?? def.minimal,
      data: overrides?.data,
    };

    this.windows.push(win);
    this.onFocusChange?.(win);
    this.saveLayout();
    return id;
  }

  close(id: string) {
    const idx = this.windows.findIndex((w) => w.id === id);
    if (idx !== -1) {
      this.windows.splice(idx, 1);
      this.saveLayout();
    }
  }

  focus(id: string) {
    const win = this.windows.find((w) => w.id === id);
    if (!win) return;
    this.topZ++;
    win.zIndex = this.topZ;
    this.onFocusChange?.(win);
  }

  move(id: string, x: number, y: number) {
    const win = this.windows.find((w) => w.id === id);
    if (win) {
      win.x = x;
      win.y = y;
      this.saveLayout();
    }
  }

  resize(id: string, width: number, height: number) {
    const win = this.windows.find((w) => w.id === id);
    if (win) {
      win.width = Math.max(200, width);
      win.height = Math.max(120, height);
      this.saveLayout();
    }
  }

  minimize(id: string) {
    const win = this.windows.find((w) => w.id === id);
    if (win) {
      win.minimized = true;
    }
  }

  toggleMaximize(id: string) {
    const win = this.windows.find((w) => w.id === id);
    if (win) {
      win.maximized = !win.maximized;
    }
  }

  /** Reorder tabs for mobile. Moves window from `fromIndex` to `toIndex`. */
  reorderTabs(fromIndex: number, toIndex: number) {
    if (fromIndex < 0 || fromIndex >= this.windows.length) return;
    if (toIndex < 0 || toIndex >= this.windows.length) return;
    const [item] = this.windows.splice(fromIndex, 1);
    this.windows.splice(toIndex, 0, item);
  }

  /** Get the URL path for the currently active widget (for URL syncing) */
  getActiveRoute(): string {
    const active = this.activeWindow;
    if (!active) return "/";
    const def = getWidgetById(active.widgetId);
    return def?.route ?? "/";
  }

  /** Check if a widget is currently open */
  isOpen(widgetId: string): boolean {
    return this.windows.some((w) => w.widgetId === widgetId);
  }

  // ── Icon positions ──

  static readonly ICON_W = 80;
  static readonly ICON_H = 100;

  moveIcon(widgetId: string, x: number, y: number) {
    const clamped = this.clampIconPos(x, y);
    this.iconPositions[widgetId] = this.resolveIconCollision(
      widgetId,
      clamped.x,
      clamped.y,
    );
    this.saveLayout();
  }

  /** Clamp an icon position to stay within desktop bounds */
  clampIconPos(x: number, y: number): IconPosition {
    const maxX = this.desktopWidth - WindowManager.ICON_W;
    const maxY =
      this.desktopHeight - WindowManager.ICON_H - WindowManager.TASKBAR_H;
    return {
      x: Math.max(0, Math.min(x, maxX)),
      y: Math.max(0, Math.min(y, maxY)),
    };
  }

  getIconPosition(widgetId: string): IconPosition | undefined {
    return this.iconPositions[widgetId];
  }

  /** Get all icon positions (pure read — returns defaults for unsaved icons). */
  getAllIconPositions(
    shortcuts: { id: string }[],
  ): Record<string, IconPosition> {
    const positions: Record<string, IconPosition> = {};
    for (let i = 0; i < shortcuts.length; i++) {
      const id = shortcuts[i].id;
      positions[id] = this.iconPositions[id] ?? { x: 24, y: 24 + i * 100 };
    }
    return positions;
  }

  /** Seed default positions for icons that haven't been placed yet. */
  seedIconDefaults(shortcuts: { id: string }[]) {
    for (let i = 0; i < shortcuts.length; i++) {
      const id = shortcuts[i].id;
      if (!this.iconPositions[id]) {
        this.iconPositions[id] = { x: 24, y: 24 + i * 100 };
      }
    }
  }

  private resolveIconCollision(
    movingId: string,
    x: number,
    y: number,
  ): IconPosition {
    const W = WindowManager.ICON_W;
    const H = WindowManager.ICON_H;

    const rectsCollide = (ax: number, ay: number, bx: number, by: number) =>
      Math.abs(ax - bx) < W && Math.abs(ay - by) < H;

    // Collect positions of all other icons
    const others: IconPosition[] = [];
    for (const [id, pos] of Object.entries(this.iconPositions)) {
      if (id !== movingId) others.push(pos);
    }

    // If no collision, return as-is
    if (!others.some((o) => rectsCollide(x, y, o.x, o.y))) {
      return { x, y };
    }

    // Find nearest non-colliding position by scanning outward in a spiral
    let bestX = x;
    let bestY = y;
    let bestDist = Infinity;

    for (let ring = 1; ring <= 8; ring++) {
      for (let dy = -ring; dy <= ring; dy++) {
        for (let dx = -ring; dx <= ring; dx++) {
          if (Math.abs(dx) !== ring && Math.abs(dy) !== ring) continue;
          const cx = x + dx * W;
          const cy = y + dy * H;
          if (cx < 0 || cy < 0) continue;
          if (
            cx > this.desktopWidth - W ||
            cy > this.desktopHeight - H - WindowManager.TASKBAR_H
          )
            continue;
          if (!others.some((o) => rectsCollide(cx, cy, o.x, o.y))) {
            const dist = dx * dx + dy * dy;
            if (dist < bestDist) {
              bestDist = dist;
              bestX = cx;
              bestY = cy;
            }
          }
        }
      }
      if (bestDist < Infinity) break;
    }

    return { x: bestX, y: bestY };
  }

  // ── Persistence ──

  private saveTimeout: ReturnType<typeof setTimeout> | undefined;

  saveLayout() {
    if (typeof window === "undefined") return;
    clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      const layout: SavedLayout = {
        windows: this.windows.map((w) => ({
          widgetId: w.widgetId,
          title: w.title,
          x: w.x,
          y: w.y,
          width: w.width,
          height: w.height,
          minimized: w.minimized,
          maximized: w.maximized,
          data: w.data,
        })),
        iconPositions: { ...this.iconPositions },
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
      } catch {
        // Storage full or unavailable — silently ignore
      }
    }, 300);
  }

  restoreLayout(): boolean {
    if (typeof window === "undefined") return false;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const layout: SavedLayout = JSON.parse(raw);

      // Restore icon positions
      if (layout.iconPositions) {
        this.iconPositions = layout.iconPositions;
      }

      // Restore windows
      if (layout.windows?.length) {
        for (const saved of layout.windows) {
          const def = getWidgetById(saved.widgetId);
          if (!def) continue;
          this.topZ++;
          const id = createId();
          const win: WindowState = {
            id,
            widgetId: saved.widgetId,
            title: saved.title,
            x: saved.x,
            y: saved.y,
            width: saved.width,
            height: saved.height,
            zIndex: this.topZ,
            minimized: saved.minimized,
            maximized: saved.maximized,
            minimal: def.minimal,
            data: saved.data,
          };
          this.windows.push(win);
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}

export const WM_CONTEXT_KEY = Symbol("window-manager");
export const NAVIGATE_KEY = Symbol("navigate");
