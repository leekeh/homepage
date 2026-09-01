import type { PathnameWithSearchOrHash } from '$app/types';
import { widgetConfigs, type WidgetConfig } from './widgets.config';
import type { Component } from 'svelte';
import { getBlogPostBySlug } from '../../content/blog/server';
import { getTreatById } from './treats/data';

export type WidgetDef = WidgetConfig;

// Auto-discover og.png files in widget subdirectories (e.g. widgets/paint/og.png)
const autoWidgetOgImages = import.meta.glob<string>('./*/og.png', {
	eager: true,
	query: '?url',
	import: 'default'
});

// Normalize name for matching: lowercase, strip dashes (e.g. 'blog-post' → 'blogpost')
function normalizeName(s: string): string {
	return s.toLowerCase().replace(/-/g, '');
}

const autoOgImageByWidgetId = new Map<string, string>();
for (const [path, url] of Object.entries(autoWidgetOgImages)) {
	const folder = path.split('/').at(-2)!;
	const normalizedFolder = normalizeName(folder);
	for (const config of widgetConfigs) {
		if (normalizeName(config.id) === normalizedFolder) {
			autoOgImageByWidgetId.set(config.id, url);
			break;
		}
	}
}

const registry = new Map<string, WidgetDef>(
	widgetConfigs.map((def) => [
		def.id,
		{ ...def, ogImage: def.ogImage ?? autoOgImageByWidgetId.get(def.id) }
	])
);

export const widgetNavigationData = [...registry.values()]
	// filter dynamic routes and non-navigable widgets (e.g. the apps drawer)
	.filter(({ route, navigable }) => !route.includes('[') && navigable !== false)
	.map(({ id, title, icon, route }) => ({
		id,
		title,
		icon,
		route
	}));

export function getWidgetById(id: string) {
	return registry.get(id);
}

export function getWidgetByRoute(
	path: string
): { widget: WidgetDef; params?: Record<string, string> } | undefined {
	// Normalize: strip trailing slashes
	const normalized = path === '/' ? '/' : path.replace(/\/+$/, '');
	for (const def of registry.values()) {
		if (def.route === normalized) return { widget: def };
		// Handle parameterized routes (e.g., /blog/[slug] matches /blog/hello-world)
		if (def.route.includes('[')) {
			const prefix = def.route.split('[')[0];
			if (normalized.startsWith(prefix) && normalized.length > prefix.length) {
				// Strip the rest-param "..." prefix so e.g. [...slug] resolves to "slug"
				const paramName = (def.route.match(/\[([^\]]+)\]/)?.[1] ?? 'param').replace(/^\.\.\./, '');
				const paramValue = normalized.slice(prefix.length);
				const params = { [paramName]: paramValue };
				// Override the widget title with the specific entry's title when available
				// (e.g. the blog post or treat behind this dynamic route).
				let resolvedTitle: string | undefined;
				if (paramName === 'slug') resolvedTitle = getBlogPostBySlug(paramValue)?.title;
				else if (def.id === 'treatdetail') resolvedTitle = getTreatById(paramValue)?.title;
				const widget = resolvedTitle ? { ...def, title: resolvedTitle } : def;
				return { widget, params };
			}
		}
	}
	return undefined;
}

/** Get the route path for a window, including any data params */
export function getRouteForWindow(
	widgetId: string,
	data?: Record<string, unknown>
): PathnameWithSearchOrHash {
	const def = getWidgetById(widgetId);
	if (!def) return '/';
	if (def.route.includes('[') && data) {
		// Strip the rest-param "..." prefix so e.g. [...slug] resolves to "slug"
		const paramName = (def.route.match(/\[([^\]]+)\]/)?.[1] ?? 'param').replace(/^\.\.\./, '');
		const paramValue = data[paramName];
		if (paramValue) {
			return (def.route.split('[')[0] + String(paramValue)) as PathnameWithSearchOrHash;
		}
	}
	return def.route;
}

const componentPromises = new Map<string, Promise<Component | null>>();

export function loadWidgetComponent(widgetId: string): Promise<Component | null> {
	console.debug(`Loading component for widget ${widgetId}`);
	const cached = componentPromises.get(widgetId);
	if (cached) return cached;

	const def = getWidgetById(widgetId);
	if (!def) return Promise.resolve(null);

	const promise = def
		.component()
		.then((mod) => mod.default)
		.catch(() => null);

	componentPromises.set(widgetId, promise);
	return promise;
}
