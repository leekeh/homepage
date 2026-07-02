import { getContext } from 'svelte';
import { getWidgetById } from '../../widgets/widgets';

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

const STORAGE_KEY = 'desktop-layout';

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
	static readonly TASKBAR_H = 36;
	static readonly MIN_WINDOW_W = 200;
	static readonly MIN_WINDOW_H = 120;
	/** Called whenever a window is brought to the front. Set by the layout. */
	onFocusChange?: (win: WindowState) => void;

	// Navigation methods attached by WindowManagerSetup
	suppressUrlSync?: boolean;
	openWidgetAndNavigate?: (widgetId: string, data?: Record<string, unknown>) => void;

	private getViewportBounds() {
		return {
			maxWidth: Math.max(1, this.desktopWidth),
			maxHeight: Math.max(1, this.desktopHeight - WindowManager.TASKBAR_H)
		};
	}

	private clampWindowSize(width: number, height: number) {
		const { maxWidth, maxHeight } = this.getViewportBounds();
		const minW = Math.min(WindowManager.MIN_WINDOW_W, maxWidth);
		const minH = Math.min(WindowManager.MIN_WINDOW_H, maxHeight);
		return {
			width: Math.max(minW, Math.min(width, maxWidth)),
			height: Math.max(minH, Math.min(height, maxHeight))
		};
	}

	private clampWindowPosition(x: number, y: number, width: number, height: number) {
		const { maxWidth, maxHeight } = this.getViewportBounds();
		return {
			x: Math.max(0, Math.min(x, Math.max(0, maxWidth - width))),
			y: Math.max(0, Math.min(y, Math.max(0, maxHeight - height)))
		};
	}

	private constrainWindow(win: WindowState) {
		if (win.maximized) return;
		const size = this.clampWindowSize(win.width, win.height);
		const pos = this.clampWindowPosition(win.x, win.y, size.width, size.height);
		win.width = size.width;
		win.height = size.height;
		win.x = pos.x;
		win.y = pos.y;
	}

	constrainWindowsToViewport() {
		for (const win of this.windows) {
			this.constrainWindow(win);
		}
	}

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
			undefined as WindowState | undefined
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
		if (!def) return '';
		this.topZ++;
		const id = createId();
		const win: WindowState = {
			id,
			widgetId,
			title: overrides?.title ?? def.title,
			x: overrides?.x ?? def.defaultX ?? 100 + ((this.windows.length * 30) % 200),
			y: overrides?.y ?? def.defaultY ?? 60 + ((this.windows.length * 30) % 150),
			width: overrides?.width ?? def.defaultWidth,
			height: overrides?.height ?? def.defaultHeight,
			zIndex: this.topZ,
			minimized: overrides?.minimized ?? false,
			maximized: overrides?.maximized ?? def.defaultMaximized ?? false,
			minimal: overrides?.minimal ?? def.minimal,
			data: overrides?.data
		};

		this.constrainWindow(win);
		this.windows.push(win);
		this.onFocusChange?.(win);
		this.saveLayout();
		return id;
	}

	closeActiveWindow() {
		const active = this.activeWindow;
		// timeout to not clash with navigation
		setTimeout(() => {
			if (active) this.close(active.id);
		}, 0);
	}

	close(id: string) {
		const idx = this.windows.findIndex((w) => w.id === id);
		if (idx === -1) {
			console.log(
				`[WindowManager] Attempted to close non-existent window with id: ${id}`,
				this.windows
			);
			return;
		}
		this.windows.splice(idx, 1);
		this.saveLayout();
		// Sync URL to the new active window after closing
		const newActive = this.activeWindow;
		if (newActive) {
			this.onFocusChange?.(newActive);
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
		if (win && !win.maximized) {
			const clamped = this.clampWindowPosition(x, y, win.width, win.height);
			win.x = clamped.x;
			win.y = clamped.y;
			this.saveLayout();
		}
	}

	snapToDirection(id: string, direction: 'left' | 'right' | 'up' | 'down') {
		const win = this.windows.find((w) => w.id === id);
		if (!win) return;

		const { maxWidth, maxHeight } = this.getViewportBounds();
		const halfWidth = Math.max(WindowManager.MIN_WINDOW_W, Math.floor(maxWidth / 2));
		const halfHeight = Math.max(WindowManager.MIN_WINDOW_H, Math.floor(maxHeight / 2));

		win.maximized = false;
		win.minimized = false;

		if (direction === 'left' || direction === 'right') {
			win.width = halfWidth;
			win.height = maxHeight;
			win.x = direction === 'left' ? 0 : maxWidth - halfWidth;
			win.y = 0;
		} else {
			win.width = maxWidth;
			win.height = halfHeight;
			win.x = 0;
			win.y = direction === 'up' ? 0 : maxHeight - halfHeight;
		}

		this.focus(id);
		this.saveLayout();
	}

	resize(id: string, width: number, height: number) {
		const win = this.windows.find((w) => w.id === id);
		if (win && !win.maximized) {
			const clampedSize = this.clampWindowSize(width, height);
			win.width = clampedSize.width;
			win.height = clampedSize.height;
			const clampedPos = this.clampWindowPosition(win.x, win.y, win.width, win.height);
			win.x = clampedPos.x;
			win.y = clampedPos.y;
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
		if (!active) return '/';
		const def = getWidgetById(active.widgetId);
		return def?.route ?? '/';
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
		this.iconPositions[widgetId] = clamped;
		this.saveLayout();
	}

	/** Clamp an icon position to stay within desktop bounds */
	clampIconPos(x: number, y: number): IconPosition {
		const maxX = this.desktopWidth - WindowManager.ICON_W;
		const maxY = this.desktopHeight - WindowManager.ICON_H - WindowManager.TASKBAR_H;
		return {
			x: Math.max(0, Math.min(x, maxX)),
			y: Math.max(0, Math.min(y, maxY))
		};
	}

	getIconPosition(widgetId: string, index = 0) {
		return this.iconPositions[widgetId] ?? { x: 24, y: 24 + index * WindowManager.ICON_H };
	}

	/** Get all icon positions (pure read — returns defaults for unsaved icons). */
	getAllIconPositions(shortcuts: { id: string }[]): Record<string, IconPosition> {
		const positions: Record<string, IconPosition> = {};
		for (let i = 0; i < shortcuts.length; i++) {
			const id = shortcuts[i].id;
			positions[id] = this.iconPositions[id] ?? { x: 24, y: 24 + i * 100 };
		}
		return positions;
	}

	/** Seed default positions for icons that haven't been placed yet, and resolve any overlaps. */
	seedIconDefaults(shortcuts: { id: string }[]) {
		const W = WindowManager.ICON_W;
		const H = WindowManager.ICON_H;
		const maxY = this.desktopHeight - H - WindowManager.TASKBAR_H;
		const posKey = (x: number, y: number) => `${x},${y}`;

		// First pass: register icons that have a unique saved position
		const claimed: Record<string, string> = {}; // "x,y" -> widgetId
		for (const { id } of shortcuts) {
			const pos = this.iconPositions[id];
			if (pos) {
				const key = posKey(pos.x, pos.y);
				if (!claimed[key]) claimed[key] = id;
			}
		}

		// Find next free column-first grid slot
		const findFreeSlot = (): { x: number; y: number } => {
			for (let col = 0; ; col++) {
				for (let row = 0; ; row++) {
					const x = 24 + col * W;
					const y = 24 + row * H;
					if (y > maxY) break;
					if (!claimed[posKey(x, y)]) return { x, y };
				}
			}
		};

		// Second pass: assign free slots to icons with no position or a colliding position
		for (const { id } of shortcuts) {
			const pos = this.iconPositions[id];
			const needsSlot = !pos || claimed[posKey(pos.x, pos.y)] !== id;
			if (needsSlot) {
				const slot = findFreeSlot();
				this.iconPositions[id] = slot;
				claimed[posKey(slot.x, slot.y)] = id;
			}
		}
	}

	/** Check if a position would collide with any other icon */
	iconPositionCollides(movingId: string, x: number, y: number): boolean {
		const W = WindowManager.ICON_W;
		const H = WindowManager.ICON_H;

		const rectsCollide = (ax: number, ay: number, bx: number, by: number) =>
			Math.abs(ax - bx) < W && Math.abs(ay - by) < H;

		// Collect positions of all other icons
		const others: IconPosition[] = [];
		for (const [id, pos] of Object.entries(this.iconPositions)) {
			if (id !== movingId) others.push(pos);
		}

		return others.some((o) => rectsCollide(x, y, o.x, o.y));
	}

	// ── Persistence ──

	private saveTimeout: ReturnType<typeof setTimeout> | undefined;
	private hasPersistenceHooks = false;

	private buildSavedLayout(): SavedLayout {
		return {
			windows: this.windows.map((w) => ({
				widgetId: w.widgetId,
				title: w.title,
				x: w.x,
				y: w.y,
				width: w.width,
				height: w.height,
				minimized: w.minimized,
				maximized: w.maximized,
				data: w.data
			})),
			iconPositions: { ...this.iconPositions }
		};
	}

	private persistLayoutNow() {
		const layout = this.buildSavedLayout();
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
		} catch {
			// Storage full or unavailable — silently ignore
		}
	}

	private ensurePersistenceHooks() {
		if (this.hasPersistenceHooks || typeof window === 'undefined') return;
		this.hasPersistenceHooks = true;

		window.addEventListener('pagehide', () => {
			if (this.saveTimeout) {
				clearTimeout(this.saveTimeout);
				this.saveTimeout = undefined;
			}
			this.persistLayoutNow();
		});
	}

	saveLayout() {
		if (typeof window === 'undefined') return;
		this.ensurePersistenceHooks();
		clearTimeout(this.saveTimeout);
		this.saveTimeout = setTimeout(() => {
			this.persistLayoutNow();
			this.saveTimeout = undefined;
		}, 300);
	}

	restoreLayout(): boolean {
		if (typeof window === 'undefined') return false;
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
				this.windows = [];
				this.topZ = 10;
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
						data: saved.data
					};
					this.constrainWindow(win);
					this.windows.push(win);
				}
				return true;
			}
			return false;
		} catch {
			return false;
		}
	}

	openWidget(widgetId: string) {
		this.open(widgetId);
	}

	resetLayout() {
		this.windows = [];
		this.iconPositions = {};
		this.topZ = 10;
		localStorage.removeItem(STORAGE_KEY);
	}
}

export const WM_CONTEXT_KEY = Symbol('window-manager');
export const WINDOW_NAVIGATE_CONTEXT_KEY = Symbol('window-navigate');
export const JS_SUPPORT_STATE_KEY = Symbol('js-support-state');

export function useWindowManager() {
	const wm = getContext<WindowManager>(WM_CONTEXT_KEY);
	if (!wm) {
		throw new Error('WindowManager context not found');
	}
	return wm;
}

export type WindowNavigateFn = (widgetId: string, data?: Record<string, unknown>) => void;

export function useWindowNavigate() {
	const navigate = getContext<WindowNavigateFn>(WINDOW_NAVIGATE_CONTEXT_KEY);
	if (!navigate) {
		throw new Error('Window navigation context not found');
	}
	return navigate;
}
