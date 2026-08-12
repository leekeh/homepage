// Emit the JSON list of absolute URLs for a QA sweep (Lighthouse) against a
// running preview server. Dynamic, so new pages are picked up automatically:
//
//   - prerendered pages come from the built output
//     (.svelte-kit/cloudflare/**/*.html) — static widgets + one page per treat,
//   - blog posts (prerender = false, SSR-only) come from /rss.xml, the app's
//     own authoritative list of published posts.
//
// Usage: node scripts/qa-routes.mjs [baseUrl] > lighthouse-urls.json
//        (baseUrl defaults to http://localhost:4173)

import { readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const BASE = process.argv[2] ?? 'http://localhost:4173';
const DIST = '.svelte-kit/cloudflare';

/** Recursively collect every *.html file under `dir`. */
function walkHtml(dir) {
	const out = [];
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const full = join(dir, entry.name);
		// Skip the immutable asset bundle — it holds no navigable pages.
		if (entry.isDirectory()) {
			if (entry.name === '_app') continue;
			out.push(...walkHtml(full));
		} else if (entry.name.endsWith('.html')) {
			out.push(full);
		}
	}
	return out;
}

/** Prerendered file path → route ("index.html" → "/", "treats/x.html" → "/treats/x"). */
function fileToRoute(file) {
	const rel = relative(DIST, file)
		.replaceAll('\\', '/')
		.replace(/\.html$/, '');
	if (rel === 'index') return '/';
	return '/' + rel.replace(/\/index$/, '');
}

function prerenderedRoutes() {
	return walkHtml(DIST).map(fileToRoute);
}

async function blogRoutes() {
	const res = await fetch(`${BASE}/rss.xml`);
	if (!res.ok) {
		throw new Error(`Could not fetch ${BASE}/rss.xml (status ${res.status})`);
	}
	const xml = await res.text();
	const links = [...xml.matchAll(/<link>([^<]+)<\/link>/g)].map((m) => m[1]);
	const paths = new Set();
	for (const link of links) {
		try {
			const { pathname } = new URL(link);
			if (/^\/blog\/[^/]+$/.test(pathname)) paths.add(pathname);
		} catch {
			// ignore non-URL <link> values (e.g. the channel self-link)
		}
	}
	return [...paths];
}

const routes = [...new Set([...prerenderedRoutes(), ...(await blogRoutes())])].sort();
const urls = routes.map((route) => new URL(route, BASE).toString());

process.stdout.write(JSON.stringify(urls, null, 2) + '\n');
