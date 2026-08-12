import { treats } from '../src/components/widgets/treats/data';
import type { APIRequestContext } from '@playwright/test';

/**
 * Single source of truth for the routes the QA gates (axe-core + Lighthouse)
 * sweep across. Everything here is derived, never hand-maintained:
 *
 *   - the navigable widget routes (mirrors the no-JS widget suite),
 *   - one route per treat (from the treats data module), and
 *   - one route per *published* blog post (discovered from /rss.xml at
 *     runtime, so it reflects the app's own publish logic — including drafts
 *     that have real frontmatter — with zero hardcoded slugs to go stale).
 *
 * Blog posts are `prerender = false` (D1-backed comments), so they never hit
 * the prerendered HTML output and can only be enumerated against a running
 * server. That's why blog discovery takes an APIRequestContext.
 */

/** Navigable widget routes — the same set the no-JS suite covers. */
export const STATIC_WIDGET_ROUTES = [
	'/',
	'/blog',
	'/paint',
	'/contact',
	'/hire-me',
	'/treats'
] as const;

/** One route per treat detail page, e.g. `/treats/cinnamon-bun`. */
export function treatRoutes(): string[] {
	return treats.map((treat) => `/treats/${treat.imgId}`);
}

/**
 * Discover every published blog post from the RSS feed. Each `<item><link>`
 * is an absolute canonical URL; we keep only the pathname so it works against
 * any base URL (localhost in CI, the real host locally).
 */
export async function discoverBlogRoutes(request: APIRequestContext): Promise<string[]> {
	const res = await request.get('/rss.xml');
	if (!res.ok()) {
		throw new Error(`Could not fetch /rss.xml for blog route discovery (status ${res.status()})`);
	}
	const xml = await res.text();

	const links = [...xml.matchAll(/<link>([^<]+)<\/link>/g)].map((m) => m[1]);
	const blogPaths = new Set<string>();
	for (const link of links) {
		let pathname: string;
		try {
			pathname = new URL(link).pathname;
		} catch {
			continue;
		}
		if (/^\/blog\/[^/]+$/.test(pathname)) {
			blogPaths.add(pathname);
		}
	}
	return [...blogPaths];
}

/**
 * The full route set for a QA sweep: widgets + treats + published blog posts.
 * Deduped, in a stable order for readable test/report output.
 */
export async function allContentRoutes(request: APIRequestContext): Promise<string[]> {
	const blog = await discoverBlogRoutes(request);
	return [...new Set([...STATIC_WIDGET_ROUTES, ...treatRoutes(), ...blog])];
}
