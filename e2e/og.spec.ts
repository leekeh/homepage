import { expect, test, type APIRequestContext, type TestInfo } from '@playwright/test';
import { STATIC_WIDGET_ROUTES, treatRoutes, discoverBlogRoutes } from './routes';

/**
 * Every URL must expose an og:image whose asset actually resolves — a missing
 * tag or a broken social card both break link previews. This sweep fetches the
 * SSR HTML for each route (no browser needed: og tags are server-rendered),
 * asserts the tag is present, and then fetches the referenced image to be sure
 * it isn't a 404.
 *
 * A route falling back to the site-wide default card is *not* a failure, just a
 * non-blocking warning (a GitHub PR annotation) nudging toward a page-specific
 * image.
 *
 * Runs as its own `og` Playwright project so CI can scope it to affected tests
 * with `--only-changed` (it re-runs when the routes/data it imports change).
 */

const OG_IMAGE_RE = /<meta\s+property="og:image"\s+content="([^"]+)"/i;

// Keep in sync with DEFAULT_OG_IMAGE in src/content/site.ts. Imported by value
// rather than from that module, which pulls in SvelteKit-only `$env` virtuals.
const DEFAULT_OG_IMAGE_PATH = '/og-default.webp';

async function assertOgImage(request: APIRequestContext, route: string, info: TestInfo) {
	const res = await request.get(route);
	expect(res.ok(), `${route} responded ${res.status()}`).toBeTruthy();

	const match = (await res.text()).match(OG_IMAGE_RE);
	expect(match, `${route} is missing an og:image meta tag`).not.toBeNull();

	// The tag holds an absolute URL; fetch it by pathname so it resolves against
	// the test server rather than the production host.
	const imgPath = new URL(match![1]).pathname;
	const img = await request.get(imgPath);
	expect(img.ok(), `og:image for ${route} (${imgPath}) responded ${img.status()}`).toBeTruthy();

	// Warn (don't fail) when a route leans on the shared fallback card.
	if (imgPath === DEFAULT_OG_IMAGE_PATH) {
		const msg = `${route} uses the default og:image — consider a page-specific social card`;
		info.annotations.push({ type: 'warning', description: msg });
		// GitHub Actions workflow command → surfaces as a PR warning annotation.
		console.log(`::warning title=Default og:image::${msg}`);
	}
}

// Widget + treat routes are known at collection time — one isolated test each.
for (const route of [...STATIC_WIDGET_ROUTES, ...treatRoutes()]) {
	test(`og:image: ${route}`, async ({ request }, info) => {
		await assertOgImage(request, route, info);
	});
}

// Blog posts are SSR-only and discovered from /rss.xml at runtime.
test('og:image: blog posts', async ({ request }, info) => {
	const routes = await discoverBlogRoutes(request);
	test.skip(routes.length === 0, 'no published blog posts');
	for (const route of routes) {
		await test.step(route, async () => {
			await assertOgImage(request, route, info);
		});
	}
});
