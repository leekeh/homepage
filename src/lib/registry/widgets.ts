import type { Component } from "svelte";

export interface WidgetDef {
  id: string;
  title: string;
  icon: Component;
  component: () => Promise<{ default: Component }>;
  route: string;
  defaultWidth: number;
  defaultHeight: number;
  defaultX?: number;
  defaultY?: number;
  resizable: boolean;
  minimal: boolean;
  hasMenuBar: boolean;
}

const registry = new Map<string, WidgetDef>();

export function registerWidget(def: WidgetDef) {
  registry.set(def.id, def);
}

export function getWidgetById(id: string): WidgetDef | undefined {
  return registry.get(id);
}

export function getWidgetByRoute(
  path: string,
): { widget: WidgetDef; params?: Record<string, string> } | undefined {
  // Normalize: strip trailing slashes
  const normalized = path === "/" ? "/" : path.replace(/\/+$/, "");
  for (const def of registry.values()) {
    if (def.route === normalized) return { widget: def };
    // Handle parameterized routes (e.g., /blog/[slug] matches /blog/hello-world)
    if (def.route.includes("[")) {
      const prefix = def.route.split("[")[0];
      if (normalized.startsWith(prefix) && normalized.length > prefix.length) {
        const paramName = def.route.match(/\[([^\]]+)\]/)?.[1] ?? "param";
        const paramValue = normalized.slice(prefix.length);
        return { widget: def, params: { [paramName]: paramValue } };
      }
    }
  }
  return undefined;
}

/** Get the route path for a window, including any data params */
export function getRouteForWindow(
  widgetId: string,
  data?: Record<string, unknown>,
): string {
  const def = getWidgetById(widgetId);
  if (!def) return "/";
  if (def.route.includes("[") && data) {
    const paramName = def.route.match(/\[([^\]]+)\]/)?.[1] ?? "param";
    const paramValue = data[paramName];
    if (paramValue) {
      return def.route.split("[")[0] + String(paramValue);
    }
  }
  return def.route;
}

export function getAllWidgets(): WidgetDef[] {
  return [...registry.values()];
}

// ── Register all widgets ──

import IconAbout from "$lib/icons/IconAbout.svelte";
import IconBlog from "$lib/icons/IconBlog.svelte";
import IconPaint from "$lib/icons/IconPaint.svelte";
import IconUses from "$lib/icons/IconUses.svelte";
import IconContact from "$lib/icons/IconContact.svelte";

registerWidget({
  id: "about",
  title: "About Me",
  icon: IconAbout,
  component: () => import("$lib/widgets/About.svelte"),
  route: "/",
  defaultWidth: 480,
  defaultHeight: 400,
  defaultX: 80,
  defaultY: 60,
  resizable: true,
  minimal: false,
  hasMenuBar: false,
});

registerWidget({
  id: "blog",
  title: "Blog",
  icon: IconBlog,
  component: () => import("$lib/widgets/Blog.svelte"),
  route: "/blog",
  defaultWidth: 560,
  defaultHeight: 460,
  defaultX: 120,
  defaultY: 40,
  resizable: true,
  minimal: false,
  hasMenuBar: true,
});

registerWidget({
  id: "paint",
  title: "Paint",
  icon: IconPaint,
  component: () => import("$lib/widgets/Paint.svelte"),
  route: "/paint",
  defaultWidth: 720,
  defaultHeight: 540,
  defaultX: 60,
  defaultY: 30,
  resizable: true,
  minimal: false,
  hasMenuBar: true,
});

registerWidget({
  id: "uses",
  title: "Uses",
  icon: IconUses,
  component: () => import("$lib/widgets/Uses.svelte"),
  route: "/uses",
  defaultWidth: 440,
  defaultHeight: 380,
  defaultX: 200,
  defaultY: 80,
  resizable: true,
  minimal: false,
  hasMenuBar: false,
});

registerWidget({
  id: "contact",
  title: "Contact",
  icon: IconContact,
  component: () => import("$lib/widgets/Contact.svelte"),
  route: "/contact",
  defaultWidth: 380,
  defaultHeight: 300,
  defaultX: 240,
  defaultY: 100,
  resizable: true,
  minimal: false,
  hasMenuBar: false,
});

registerWidget({
  id: "blogpost",
  title: "Blog Post",
  icon: IconBlog,
  component: () => import("$lib/widgets/BlogPost.svelte"),
  route: "/blog/[slug]",
  defaultWidth: 560,
  defaultHeight: 480,
  defaultX: 140,
  defaultY: 50,
  resizable: true,
  minimal: false,
  hasMenuBar: false,
});
