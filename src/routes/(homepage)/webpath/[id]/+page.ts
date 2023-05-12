/** @type {import('./$types').PageServerLoad} */
import { error } from '@sveltejs/kit';

import type { ComponentType, SvelteComponentTyped } from 'svelte';
import pagesMap from './metadata';

const pagesArray = pagesMap.map((section) => section.pages).flat();

export const load = async ({ params }) => {
	const id = params.id;
	const comps = import.meta.glob<Record<string, ComponentType<SvelteComponentTyped>>>(
		'../pages/**/*.svelte'
	);

	const match = comps[`../pages/${id}.svelte`];

	const index = pagesArray.findIndex((page) => page.id === params.id);

	if (!match || index === -1) {
		throw error(404, {
			message: 'Not found'
		});
	}

	const page = (await match()).default;
	const metadata = pagesArray[index];
	const previous = pagesArray[index - 1]?.id;
	const next = pagesArray[index + 1]?.id;

	return {
		page,
		title: metadata.title,
		next,
		previous
	};
};
