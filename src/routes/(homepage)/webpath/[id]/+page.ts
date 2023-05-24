/** @type {import('./$types').PageServerLoad} */
import { error } from '@sveltejs/kit';

import type { ComponentType, SvelteComponentTyped } from 'svelte';
import pageMap from './pageMap';
import type { PageMetaData } from '../types';

const pagesArray = pageMap.map((section) => section.pages).flat();

export const load = async ({ params }) => {
	const id = params.id;

	const pagesGlob = import.meta.glob<Record<string, any>>('../pages/**/*.svelte');

	const match = pagesGlob[`../pages/${id}.svelte`];
	const module = await match();
	const page = module.default as ComponentType<SvelteComponentTyped>;
	const metadata = module.metadata as PageMetaData;

	const index = pagesArray.findIndex((page) => page === params.id);
	const previous = pagesArray[index - 1];
	const next = pagesArray[index + 1];

	if (!match || index === -1) {
		throw error(404, {
			message: 'Not found'
		});
	}

	return {
		page: page,
		metadata,
		next,
		previous
	};
};
