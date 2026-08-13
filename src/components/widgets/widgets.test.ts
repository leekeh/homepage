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

	it('returns undefined for an unknown route', () => {
		expect(getWidgetByRoute('/does-not-exist')).toBeUndefined();
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

	it('falls back to "/" for an unknown widget', () => {
		expect(getRouteForWindow('nope')).toBe('/');
	});
});

describe('widgetNavigationData', () => {
	it('excludes dynamic and non-navigable widgets', () => {
		const ids = widgetNavigationData.map((w) => w.id);
		expect(ids).toContain('about');
		// 'apps' is navigable:false, blogpost/treatdetail are dynamic ([param]) routes.
		expect(ids).not.toContain('apps');
		expect(ids).not.toContain('blogpost');
		expect(ids).not.toContain('treatdetail');
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
