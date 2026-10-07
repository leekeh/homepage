import { folders } from '../../content/folders/server';

export const prerender = true;

// One prerendered page per folder, so every folder has its own crawlable URL.
export function entries() {
	return Object.keys(folders).map((id) => ({ id }));
}
