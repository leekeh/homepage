import { readdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, vi } from 'vitest';
import {
	folders,
	getAdjacentPhotos,
	getAllFolders,
	getFolderMeta,
	getPhotoById,
	getPhotosByFolder,
	photoFilename,
	photoSrc,
	photos,
	thumbSrc
} from './data';

const FOLDERS_DIR = fileURLToPath(new URL('.', import.meta.url));
// Keep in sync with the glob in data.ts / SOURCE_EXTS in the thumbnail plugin.
const SOURCE_EXTS = new Set(['.webp', '.gif', '.png', '.jpg', '.jpeg']);
const THUMB_SUFFIX = '-thumb.webp';

describe('getFolderMeta', () => {
	it('finds a folder by id', () => {
		expect(getFolderMeta('img')?.title).toBe('My Pictures');
	});

	it('returns undefined for an unknown id', () => {
		expect(getFolderMeta('nope')).toBeUndefined();
	});
});

describe('getAllFolders', () => {
	it('lists every discovered folder', () => {
		expect(getAllFolders().map((f) => f.id)).toContain('img');
	});
});

describe('getPhotosByFolder', () => {
	it('every photo references a defined folder', () => {
		for (const photo of photos) {
			expect(folders[photo.folderId], `folder for ${photo.imgId}`).toBeDefined();
		}
	});

	it('returns only photos belonging to the given folder', () => {
		const result = getPhotosByFolder('img');
		expect(result.length).toBeGreaterThan(0);
		expect(result.every((photo) => photo.folderId === 'img')).toBe(true);
	});

	it('returns an empty array for an unknown folder', () => {
		expect(getPhotosByFolder('nope')).toEqual([]);
	});

	it('every image file on disk is referenced by a photo in its folder', () => {
		const unused: string[] = [];
		for (const folderId of Object.keys(folders)) {
			const expectedFilenames = new Set(
				getPhotosByFolder(folderId).map((photo) => photoFilename(photo))
			);
			for (const file of readdirSync(join(FOLDERS_DIR, folderId))) {
				if (file.endsWith(THUMB_SUFFIX)) continue;
				if (!SOURCE_EXTS.has(extname(file).toLowerCase())) continue;
				if (!expectedFilenames.has(file)) unused.push(`${folderId}/${file}`);
			}
		}
		expect(unused).toEqual([]);
	});
});

describe('getPhotoById', () => {
	it('finds a photo by its folder and imgId', () => {
		expect(getPhotoById('img', 'chill')?.ext).toBe('gif');
	});

	it('returns undefined for an unknown id', () => {
		expect(getPhotoById('img', 'nope')).toBeUndefined();
	});

	it('returns undefined when the imgId belongs to a different folder', () => {
		expect(getPhotoById('nope', 'chill')).toBeUndefined();
	});
});

describe('getAdjacentPhotos', () => {
	it('wraps around to the last photo when going before the first', () => {
		const siblings = getPhotosByFolder('img');
		const { prev } = getAdjacentPhotos('img', siblings[0].imgId);
		expect(prev?.imgId).toBe(siblings[siblings.length - 1].imgId);
	});

	it('wraps around to the first photo when going past the last', () => {
		const siblings = getPhotosByFolder('img');
		const { next } = getAdjacentPhotos('img', siblings[siblings.length - 1].imgId);
		expect(next?.imgId).toBe(siblings[0].imgId);
	});

	it('returns no neighbors for an unknown photo', () => {
		expect(getAdjacentPhotos('img', 'nope')).toEqual({});
	});
});

describe('asset src helpers', () => {
	// Assets are resolved via import.meta.glob to whatever build URL Vite
	// assigns (hashed in production, a plain /src path in dev/test), so these
	// check the resolved filename rather than a hardcoded absolute path.

	it('uses the configured extension', () => {
		expect(photoSrc({ folderId: 'img', imgId: 'chill', ext: 'gif' } as never)).toContain(
			'chill.gif'
		);
		expect(photoSrc({ folderId: 'img', imgId: 'hero', ext: 'png' } as never)).toContain('hero.png');
	});

	it('builds the display filename, defaulting to webp', () => {
		expect(photoFilename({ imgId: 'hero' } as never)).toBe('hero.webp');
		expect(photoFilename({ imgId: 'chill', ext: 'gif' } as never)).toBe('chill.gif');
	});

	it('resolves the generated thumbnail', () => {
		expect(thumbSrc({ folderId: 'img', imgId: 'chill' } as never)).toContain('chill-thumb.webp');
	});

	it('defaults to webp when no extension is given, and falls back to a placeholder when the asset is missing', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		expect(photoSrc({ folderId: 'img', imgId: 'does-not-exist' } as never)).toBe('img.png');
		expect(warn).toHaveBeenCalledWith(expect.stringContaining('does-not-exist.webp'));
		warn.mockRestore();
	});
});
