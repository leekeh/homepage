import type { PathnameWithSearchOrHash } from '$app/types';
import { widgetConfigs, type WidgetConfig } from './widgets.config';
import type { Component } from 'svelte';
import { getBlogPostBySlug } from '../../content/blog/server';
import { getTreatById } from './treats/data';
import {
	getAllFolders,
	getFolderMeta,
	getPhotoById,
	photoFilename
} from '../../content/folders/server';

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

// One nav entry per folder — there's no overview page to link to instead, so
// every folder (however many there are) gets its own desktop icon/nav entry
// straight at `/{folderId}`, all backed by the same `folderdetail` widget.
const folderNavEntries = getAllFolders().map(({ id, meta }) => ({
	id: `folder:${id}`,
	title: meta.title,
	icon: registry.get('folderdetail')!.icon,
	route: `/${id}` as PathnameWithSearchOrHash
}));

export const widgetNavigationData = [
	...[...registry.values()]
		// filter dynamic ([param]) routes and non-navigable widgets (e.g. the
		// apps drawer, or folderdetail — see folderNavEntries above)
		.filter(({ route, navigable }) => !route.includes('[') && navigable !== false)
		.map(({ id, title, icon, route }) => ({ id, title, icon, route })),
	...folderNavEntries
];

export function getWidgetById(id: string) {
	return registry.get(id);
}

/**
 * Match a route pattern (e.g. `/[id]/[photoId]` or `/blog/[...slug]`)
 * against a concrete pathname, both already split into segments. `[name]`
 * matches exactly one segment; `[...name]` must be the last segment and
 * matches one or more remaining segments (joined back with "/"). Returns
 * `null` when the pattern and path don't line up.
 */
function matchRouteSegments(
	routeSegments: string[],
	pathSegments: string[]
): Record<string, string> | null {
	const params: Record<string, string> = {};
	for (let i = 0; i < routeSegments.length; i++) {
		const segment = routeSegments[i];
		const restMatch = segment.match(/^\[\.\.\.([^\]]+)\]$/);
		if (restMatch) {
			if (pathSegments.length < i + 1) return null;
			params[restMatch[1]] = pathSegments.slice(i).join('/');
			return params;
		}
		const dynamicMatch = segment.match(/^\[([^\]]+)\]$/);
		if (dynamicMatch) {
			if (pathSegments[i] === undefined) return null;
			params[dynamicMatch[1]] = pathSegments[i];
			continue;
		}
		if (pathSegments[i] !== segment) return null;
	}
	return pathSegments.length === routeSegments.length ? params : null;
}

/**
 * Unlike blogpost/treatdetail (nested under their own literal `/blog`,
 * `/treats` prefix, so any slug/id syntactically belongs to them and an
 * unknown one just renders that widget's own not-found state), the folder
 * routes live at the registry's bare root (`/[id]`, `/[id]/[photoId]`) with
 * no distinguishing prefix — so an unrelated unknown path like
 * `/does-not-exist` would otherwise syntactically match too. Requiring a
 * real folder id here keeps those routes matching only real folders and lets
 * everything else fall through to the real 404, mirroring the `[id=folder]`
 * param matcher that guards the same route on the SvelteKit side (see
 * src/params/folder.ts).
 */
function isKnownFolderRoute(widgetId: string, params: Record<string, string>): boolean {
	if (widgetId === 'folderdetail' || widgetId === 'photoviewer') {
		return !!getFolderMeta(params.id);
	}
	return true;
}

/** Per-widget-id title resolution: swap in the specific entry's title behind a dynamic route. */
function resolveDynamicTitle(widgetId: string, params: Record<string, string>): string | undefined {
	if (widgetId === 'blogpost' && params.slug) return getBlogPostBySlug(params.slug)?.title;
	if (widgetId === 'treatdetail' && params.id) return getTreatById(params.id)?.title;
	if (widgetId === 'folderdetail' && params.id) return getFolderMeta(params.id)?.title;
	if (widgetId === 'photoviewer' && params.id && params.photoId) {
		const photo = getPhotoById(params.id, params.photoId);
		return photo && photoFilename(photo);
	}
	return undefined;
}

export function getWidgetByRoute(
	path: string
): { widget: WidgetDef; params?: Record<string, string> } | undefined {
	// Normalize: strip trailing slashes
	const normalized = path === '/' ? '/' : path.replace(/\/+$/, '');
	const pathSegments = normalized.split('/').filter(Boolean);
	for (const def of registry.values()) {
		const routeSegments = def.route.split('/').filter(Boolean);
		const matched = matchRouteSegments(routeSegments, pathSegments);
		if (!matched) continue;
		if (!isKnownFolderRoute(def.id, matched)) continue;
		const params = matched;
		// Override the widget title with the specific entry's title when available
		// (e.g. the blog post, treat, or photo behind this dynamic route).
		const resolvedTitle = resolveDynamicTitle(def.id, params);
		const widget = resolvedTitle ? { ...def, title: resolvedTitle } : def;
		return { widget, params };
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
	if (!def.route.includes('[') || !data) return def.route;

	let interpolated = '';
	for (const segment of def.route.split('/')) {
		const restMatch = segment.match(/^\[\.\.\.([^\]]+)\]$/);
		const dynamicMatch = segment.match(/^\[([^\]]+)\]$/);
		const name = restMatch?.[1] ?? dynamicMatch?.[1];
		if (!name) {
			interpolated += `${segment}/`;
			continue;
		}
		const value = data[name];
		if (value == null) return '/';
		interpolated += `${String(value)}/`;
	}
	return interpolated.replace(/\/$/, '') as PathnameWithSearchOrHash;
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
