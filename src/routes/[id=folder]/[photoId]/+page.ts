import { photos } from '../../../content/folders/data';

export const prerender = true;

// One prerendered page per photo, so every photo has its own crawlable URL.
export function entries() {
	return photos.map((photo) => ({ id: photo.folderId, photoId: photo.imgId }));
}
