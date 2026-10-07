import { describe, expect, it } from 'vitest';
import {
	getRouteForWindow,
	getWidgetById,
	getWidgetByRoute,
	widgetNavigationData
} from './widgets';

describe('getWidgetByRoute', () => {
	it('matches a static route', () => {
		expect(getWidgetByRoute('/blog')?.widget.id).toBe('blog');
	});

	it('matches the root route', () => {
		expect(getWidgetByRoute('/')?.widget.id).toBe('about');
	});

	it('ignores a trailing slash', () => {
		expect(getWidgetByRoute('/blog/')?.widget.id).toBe('blog');
	});

	it('matches a dynamic route and extracts the param', () => {
		const match = getWidgetByRoute('/blog/hello-world');
		expect(match?.widget.id).toBe('blogpost');
		expect(match?.params).toEqual({ slug: 'hello-world' });
	});

	it('matches the treat detail dynamic route', () => {
		const match = getWidgetByRoute('/treats/cinnamon-bun');
		expect(match?.widget.id).toBe('treatdetail');
		expect(match?.params).toEqual({ id: 'cinnamon-bun' });
	});

	it('matches the folder detail dynamic route', () => {
		const match = getWidgetByRoute('/img');
		expect(match?.widget.id).toBe('folderdetail');
		expect(match?.params).toEqual({ id: 'img' });
	});

	it('matches the photoviewer dynamic route and extracts both params', () => {
		const match = getWidgetByRoute('/img/chill');
		expect(match?.widget.id).toBe('photoviewer');
		expect(match?.params).toEqual({ id: 'img', photoId: 'chill' });
	});

	it("titles the photoviewer window with the photo's filename, not its authored title", () => {
		const match = getWidgetByRoute('/img/chill');
		expect(match?.widget.title).toBe('chill.gif');
	});

	it('prefers the single-segment folder route over the two-segment photoviewer pattern', () => {
		// "/img" alone must resolve to the folder widget, not be swallowed by
		// photoviewer's [id]/[photoId].
		const match = getWidgetByRoute('/img');
		expect(match?.widget.id).not.toBe('photoviewer');
	});

	it('prefers a static widget route over the root folder route', () => {
		// The folder routes live at the registry's own root ("/[id]",
		// "/[id]/[photoId]") now that there's no "/folders" prefix to
		// disambiguate them — the registry is matched in array order, and
		// every static route is declared before the folder ones, so this must
		// keep resolving to the real widget, not the folder catch-all.
		expect(getWidgetByRoute('/paint')?.widget.id).toBe('paint');
		expect(getWidgetByRoute('/treats/cinnamon-bun')?.widget.id).toBe('treatdetail');
	});

	it('returns undefined for an unknown route', () => {
		// Must not be swallowed by the folder route's bare "/[id]" pattern.
		expect(getWidgetByRoute('/does-not-exist')).toBeUndefined();
	});

	it('still matches photoviewer for an unknown photo within a real folder', () => {
		// The guard only checks the folder id, not the photo id — an invalid
		// photoId under a real folder still reaches PhotoViewer's own
		// not-found state instead of falling through to the site 404.
		const match = getWidgetByRoute('/img/does-not-exist');
		expect(match?.widget.id).toBe('photoviewer');
	});

	it('does not match the bare prefix of a dynamic route', () => {
		// "/blog" is the blog list, not a blog post with an empty slug.
		expect(getWidgetByRoute('/blog')?.widget.id).toBe('blog');
	});
});

describe('getRouteForWindow', () => {
	it('returns the static route for a widget', () => {
		expect(getRouteForWindow('paint')).toBe('/paint');
	});

	it('interpolates params into a dynamic route', () => {
		expect(getRouteForWindow('blogpost', { slug: 'hello-world' })).toBe('/blog/hello-world');
	});

	it('interpolates multiple params into a multi-segment dynamic route', () => {
		expect(getRouteForWindow('photoviewer', { id: 'img', photoId: 'chill' })).toBe('/img/chill');
	});

	it('falls back to "/" for an unknown widget', () => {
		expect(getRouteForWindow('nope')).toBe('/');
	});

	it('falls back to "/" when a required param is missing', () => {
		expect(getRouteForWindow('photoviewer', { id: 'img' })).toBe('/');
	});
});

describe('widgetNavigationData', () => {
	it('excludes dynamic and non-navigable widgets', () => {
		const ids = widgetNavigationData.map((w) => w.id);
		expect(ids).toContain('about');
		// 'apps' is navigable:false; 'folderdetail' is excluded too — it gets
		// one synthesized nav entry per folder instead (see below) rather than
		// a single generic entry, since it's backed by many real instances.
		expect(ids).not.toContain('apps');
		expect(ids).not.toContain('folderdetail');
		expect(ids).not.toContain('blogpost');
		expect(ids).not.toContain('treatdetail');
		expect(ids).not.toContain('photoviewer');
	});

	it('includes one nav entry per folder, routed straight at it', () => {
		const entry = widgetNavigationData.find((w) => w.route === '/img');
		expect(entry).toBeDefined();
		expect(entry?.title).toBe('My Pictures');

		const adaEntry = widgetNavigationData.find((w) => w.route === '/ada');
		expect(adaEntry).toBeDefined();
	});
});

describe('getWidgetById', () => {
	it('returns the config for a known id', () => {
		expect(getWidgetById('paint')?.route).toBe('/paint');
	});

	it('returns undefined for an unknown id', () => {
		expect(getWidgetById('nope')).toBeUndefined();
	});
});
