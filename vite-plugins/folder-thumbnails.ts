// Auto-generates the `{imgId}-thumb.webp` grid thumbnail for every photo
// under src/content/folders/*/, so thumbnails never have to be authored by
// hand — drop a full-size image next to a folder's `folder.ts` and its
// thumbnail exists on the next dev-server boot or build. Uses `sharp` (same
// dependency and encode style as scripts/optimize-images.mjs), but unlike
// that script this runs automatically as part of the Vite pipeline instead
// of a manual step, since the grid can't render without these.
import { readdirSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import sharp from 'sharp';
import type { Plugin } from 'vite';

const CONTENT_DIR = join(process.cwd(), 'src/content/folders');
const SOURCE_EXTS = new Set(['.webp', '.gif', '.png', '.jpg', '.jpeg']);
const THUMB_SUFFIX = '-thumb.webp';
const THUMB_SIZE = 480;

function listFolderDirs(): string[] {
	let entries;
	try {
		entries = readdirSync(CONTENT_DIR, { withFileTypes: true });
	} catch {
		return [];
	}
	return entries.filter((e) => e.isDirectory()).map((e) => join(CONTENT_DIR, e.name));
}

function isUpToDate(sourcePath: string, thumbPath: string): boolean {
	try {
		return statSync(thumbPath).mtimeMs >= statSync(sourcePath).mtimeMs;
	} catch {
		return false;
	}
}

async function generateThumb(sourcePath: string, thumbPath: string) {
	// Omitting `animated: true` reads only the first frame, so animated
	// GIFs collapse to a static thumbnail, matching the full-viewer behavior.
	await sharp(sourcePath)
		// Bakes EXIF orientation (e.g. phone photos shot in portrait) into the
		// pixels before cropping — otherwise `resize` crops the raw sensor
		// buffer and the sideways framing gets baked into the thumbnail, since
		// the webp output below carries no orientation tag to correct it.
		.rotate()
		.resize(THUMB_SIZE, THUMB_SIZE, { fit: 'cover' })
		.webp({ quality: 75 })
		.toFile(thumbPath);
}

/** Generate any missing/stale thumbnails under every folder directory. Safe to call repeatedly — up-to-date thumbnails are skipped. */
export async function generateFolderThumbnails(): Promise<void> {
	for (const dir of listFolderDirs()) {
		let files: string[];
		try {
			files = readdirSync(dir);
		} catch {
			continue;
		}
		for (const file of files) {
			if (file.endsWith(THUMB_SUFFIX)) continue;
			const ext = extname(file).toLowerCase();
			if (!SOURCE_EXTS.has(ext)) continue;

			const stem = file.slice(0, -ext.length);
			const sourcePath = join(dir, file);
			const thumbPath = join(dir, `${stem}${THUMB_SUFFIX}`);
			if (isUpToDate(sourcePath, thumbPath)) continue;

			try {
				await generateThumb(sourcePath, thumbPath);
			} catch (err) {
				console.warn(`[folder-thumbnails] failed to generate thumbnail for ${sourcePath}:`, err);
			}
		}
	}
}

export function folderThumbnails(): Plugin {
	return {
		name: 'folder-thumbnails',
		// Covers `vite build` / prerender, so the thumbnail glob in
		// content/folders/server.ts always resolves before it's transformed.
		async buildStart() {
			await generateFolderThumbnails();
		},
		// Covers `vite dev`: generate once up front, then keep watching so a
		// photo dropped in mid-session gets its thumbnail without a restart.
		async configureServer(server) {
			await generateFolderThumbnails();
			server.watcher.add(CONTENT_DIR);
			server.watcher.on('add', (path) => {
				if (path.startsWith(CONTENT_DIR)) void generateFolderThumbnails();
			});
		}
	};
}
