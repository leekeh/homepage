/** @type {import('./$types').PageServerLoad} */
import { error } from '@sveltejs/kit';

import pageMap from '../(articles)/pageMap';
import type { PageMetaData } from '../types';

const pagesArray = pageMap.map((section) => section.pages).flat();

export const load = async ({ url }) => {
	const id = url.pathname.slice(url.pathname.lastIndexOf('/') + 1);

	const index = pagesArray.findIndex((page) => page === id);

	if (index === -1) {
		throw error(404, {
			message: 'Not found'
		});
	}

	for (const [key, value] of Object.entries(
		import.meta.glob<Record<string, any>>('./**/*.svelte')
	)) {
		if (key.endsWith(`${id}/+page.svelte`)) {
			const module = await value();
			const metadata = module.metadata as PageMetaData;

			const previous = pagesArray[index - 1];
			const next = pagesArray[index + 1];

			return {
				metadata,
				next,
				previous
			};
		}
	}

	throw error(404, {
		message: 'Not found'
	});
};
