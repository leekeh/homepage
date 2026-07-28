import { treats } from '@widgets/treats/data';

export const prerender = true;

// One prerendered page per treat, so every treat has its own crawlable URL.
export function entries() {
	return treats.map((treat) => ({ id: treat.imgId }));
}
