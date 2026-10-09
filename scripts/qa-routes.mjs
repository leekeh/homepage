// Emit the JSON list of absolute URLs for a QA sweep (Lighthouse) against a
// running preview server. Dynamic, so new pages are picked up automatically:
//
//   - prerendered pages come from the built output
//     (.svelte-kit/cloudflare/**/*.html) — static widgets + one page per treat,
//   - blog posts (prerender = false, SSR-only) come from /rss.xml, the app's
//     own authoritative list of published posts.
//
// Every folder photo renders through the same PhotoViewer component — only
// the image differs — so a full Lighthouse audit (3 runs/url) of every photo
// buys nothing over auditing one, and folders can hold dozens of photos.
// Folder index pages are kept in full; photo pages are capped to one static
// image + one gif (gifs render differently — no thumbnail animation) total.
//
// Usage: node scripts/qa-routes.mjs [baseUrl] > lighthouse-urls.json
//        (baseUrl defaults to http://localhost:4173)

import { extname, join, relative } from 'node:path';
import { readdirSync } from 'node:fs';

const BASE = process.argv[2] ?? 'http://localhost:4173';
const DIST = '.svelte-kit/cloudflare';
const FOLDERS_SRC_DIR = 'src/content/folders';
const THUMB_SUFFIX = '-thumb.webp';
const IMAGE_EXTS = new Set(['.webp', '.gif', '.png', '.jpg', '.jpeg']);

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

function listFolderIds() {
	try {
		return readdirSync(FOLDERS_SRC_DIR, { withFileTypes: true })
			.filter((e) => e.isDirectory())
			.map((e) => e.name);
	} catch {
		return [];
	}
}

/** One static-image route and one gif route (if any), across all folders. */
function sampleFolderPhotoRoutes(folderIds) {
	let image, gif;
	for (const folderId of folderIds) {
		if (image && gif) break;
		let files;
		try {
			files = readdirSync(join(FOLDERS_SRC_DIR, folderId));
		} catch {
			continue;
		}
		for (const file of files) {
			if (file.endsWith(THUMB_SUFFIX)) continue;
			const ext = extname(file).toLowerCase();
			if (!IMAGE_EXTS.has(ext)) continue;
			const route = `/${folderId}/${file.slice(0, -ext.length)}`;
			if (ext === '.gif') gif ??= route;
			else image ??= route;
		}
	}
	return [image, gif].filter(Boolean);
}

/** Keep every folder index route, but only the sampled photo routes within folders. */
function limitFolderPhotoRoutes(routes, folderIds) {
	const folderIdSet = new Set(folderIds);
	const sampled = new Set(sampleFolderPhotoRoutes(folderIds));
	return routes.filter((route) => {
		const [first, second, ...rest] = route.split('/').filter(Boolean);
		if (rest.length > 0 || !second || !folderIdSet.has(first)) return true;
		return sampled.has(`/${first}/${second}`);
	});
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

const limitedPrerenderedRoutes = limitFolderPhotoRoutes(prerenderedRoutes(), listFolderIds());
const routes = [...new Set([...limitedPrerenderedRoutes, ...(await blogRoutes())])].sort();
const urls = routes.map((route) => new URL(route, BASE).toString());

process.stdout.write(JSON.stringify(urls, null, 2) + '\n');
