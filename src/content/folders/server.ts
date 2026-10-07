import type { Photo, FolderMeta, PhotoInput } from '.';

type FolderModule = {
	meta: FolderMeta;
	photos: PhotoInput[];
};

// Auto-discover every folder's metadata module — one directory per folder,
// each with its own `folder.ts` and colocated images, the same way blog posts
// each get their own directory under `posts/`.
const folderModules = import.meta.glob('./*/folder.ts', { eager: true }) as Record<
	string,
	FolderModule
>;

// Eagerly resolve every photo asset to its build URL up front, keyed by
// "folderId/filename", so `photoSrc`/`thumbSrc` stay simple lookups. Thumbnails
// (`{imgId}-thumb.webp`) are generated automatically by the Vite plugin in
// `vite-plugins/folder-thumbnails.ts` — nothing to author by hand.
const photoAssets = import.meta.glob<string>('./*/*.{webp,gif,png,jpg,jpeg}', {
	eager: true,
	query: '?url',
	import: 'default'
});

function getFolderIdFromPath(path: string): string {
	// e.g. "./img/folder.ts" -> "img"
	return path.split('/').slice(0, -1).pop() ?? path;
}

/** Served from `static/` when a declared photo's file is missing, so a bad `folder.ts` entry never renders a broken `<img src="">`. */
const FALLBACK_PHOTO_URL = 'img.png';

function assetUrl(folderId: string, filename: string): string {
	const url = photoAssets[`./${folderId}/${filename}`];
	if (!url) console.warn(`[folders] missing photo asset: ${folderId}/${filename}`);
	return url ?? FALLBACK_PHOTO_URL;
}

export const folders: Record<string, FolderMeta> = Object.fromEntries(
	Object.entries(folderModules).map(([path, mod]) => [getFolderIdFromPath(path), mod.meta])
);

export const photos: Photo[] = Object.entries(folderModules).flatMap(([path, mod]) => {
	const folderId = getFolderIdFromPath(path);
	return mod.photos.map((photo) => ({ ...photo, folderId }));
});

export function getAllFolders(): { id: string; meta: FolderMeta }[] {
	return Object.entries(folders).map(([id, meta]) => ({ id, meta }));
}

export function getFolderMeta(folderId: string): FolderMeta | undefined {
	return folders[folderId];
}

export function getPhotosByFolder(folderId: string): Photo[] {
	return photos.filter((photo) => photo.folderId === folderId);
}

export function getPhotoById(folderId: string, imgId: string): Photo | undefined {
	return photos.find((photo) => photo.folderId === folderId && photo.imgId === imgId);
}

/** The previous/next photo within the same folder, wrapping around, for viewer navigation. */
export function getAdjacentPhotos(folderId: string, imgId: string): { prev?: Photo; next?: Photo } {
	const photo = getPhotoById(folderId, imgId);
	if (!photo) return {};
	const siblings = getPhotosByFolder(photo.folderId);
	if (siblings.length < 2) return {};
	const index = siblings.findIndex((p) => p.imgId === imgId);
	return {
		prev: siblings[(index - 1 + siblings.length) % siblings.length],
		next: siblings[(index + 1) % siblings.length]
	};
}

/** The photo's on-disk filename, e.g. "chill.gif" — also its display name (window title) until a real title is authored. */
export function photoFilename(photo: Photo): string {
	return `${photo.imgId}.${photo.ext ?? 'webp'}`;
}

/** Full-size image — webp by default, or another raster format. */
export function photoSrc(photo: Photo): string {
	return assetUrl(photo.folderId, photoFilename(photo));
}

/** Small WebP thumbnail for folder/photo grids — always a static frame, even for gifs. */
export function thumbSrc(photo: Photo): string {
	return assetUrl(photo.folderId, `${photo.imgId}-thumb.webp`);
}
