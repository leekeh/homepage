import type { PathnameWithSearchOrHash } from '$app/types';
import { widgetConfigs, type WidgetConfig } from './widgets.config';
import type { Component } from 'svelte';

export type WidgetDef = WidgetConfig;

const registry = new Map<string, WidgetDef>(widgetConfigs.map((def) => [def.id, def]));

export const widgetNavigationData = [...registry.values()]
	// filter dynamic routes, those can only be accessed from other widgets or direct URL
	.filter(({ route }) => !route.includes('['))
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
				const paramName = def.route.match(/\[([^\]]+)\]/)?.[1] ?? 'param';
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
	data?: Record<string, unknown>
): PathnameWithSearchOrHash {
	const def = getWidgetById(widgetId);
	if (!def) return '/';
	if (def.route.includes('[') && data) {
		const paramName = def.route.match(/\[([^\]]+)\]/)?.[1] ?? 'param';
		const paramValue = data[paramName];
		if (paramValue) {
			return def.route.split('[')[0] + String(paramValue);
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
