import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { treats } from '../src/components/widgets/treats/data';
import type { APIRequestContext } from '@playwright/test';
import type { FolderMeta, PhotoInput } from '../src/content/folders';

/**
 * Single source of truth for the routes the QA gates (axe-core + Lighthouse)
 * sweep across. Everything here is derived, never hand-maintained:
 *
 *   - the navigable widget routes (mirrors the no-JS widget suite),
 *   - one route per treat (from the treats data module),
 *   - one route per folder and one per photo (from each folder's `folder.ts`
 *     — each folder gets its own top-level path, e.g. `/img`), and
 *   - one route per *published* blog post (discovered from /rss.xml at
 *     runtime, so it reflects the app's own publish logic — including drafts
 *     that have real frontmatter — with zero hardcoded slugs to go stale).
 *
 * Blog posts are `prerender = false` (D1-backed comments), so they never hit
 * the prerendered HTML output and can only be enumerated against a running
 * server. That's why blog discovery takes an APIRequestContext.
 */

const FOLDERS_DIR = fileURLToPath(new URL('../src/content/folders/', import.meta.url));

/**
 * `src/content/folders/server.ts` discovers folders with `import.meta.glob`,
 * a Vite-only macro that doesn't exist when this module is loaded directly
 * by Playwright (outside the Vite pipeline). Rediscover the same folders by
 * reading the directory and dynamically importing each `folder.ts` — which,
 * unlike `server.ts`, has no Vite-only syntax of its own.
 */
async function loadFolders(): Promise<{
	folders: Record<string, FolderMeta>;
	photos: { folderId: string; imgId: string }[];
}> {
	const folders: Record<string, FolderMeta> = {};
	const photos: { folderId: string; imgId: string }[] = [];
	const entries = readdirSync(FOLDERS_DIR, { withFileTypes: true }).filter((e) => e.isDirectory());
	for (const entry of entries) {
		const mod = (await import(pathToFileURL(join(FOLDERS_DIR, entry.name, 'folder.ts')).href)) as {
			meta: FolderMeta;
			photos: PhotoInput[];
		};
		folders[entry.name] = mod.meta;
		photos.push(...mod.photos.map((photo) => ({ folderId: entry.name, imgId: photo.imgId })));
	}
	return { folders, photos };
}

/** Navigable widget routes — the same set the no-JS suite covers. */
export const STATIC_WIDGET_ROUTES = [
	'/',
	'/blog',
	'/paint',
	'/contact',
	'/hire-me',
	'/treats',
	'/accessibility'
] as const;

/** One route per treat detail page, e.g. `/treats/cinnamon-bun`. */
export function treatRoutes(): string[] {
	return treats.map((treat) => `/treats/${treat.imgId}`);
}

/** One route per folder, and one per photo, e.g. `/img/chill`. */
export async function folderRoutes(): Promise<string[]> {
	const { folders, photos } = await loadFolders();
	return [
		...Object.keys(folders).map((id) => `/${id}`),
		...photos.map((photo) => `/${photo.folderId}/${photo.imgId}`)
	];
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
 * The full route set for a QA sweep: widgets + treats + folders/photos +
 * published blog posts. Deduped, in a stable order for readable test/report
 * output.
 */
export async function allContentRoutes(request: APIRequestContext): Promise<string[]> {
	const [blog, folders] = await Promise.all([discoverBlogRoutes(request), folderRoutes()]);
	return [...new Set([...STATIC_WIDGET_ROUTES, ...treatRoutes(), ...folders, ...blog])];
}
