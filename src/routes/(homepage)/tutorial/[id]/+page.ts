/** @type {import('./$types').PageServerLoad} */
import { error } from '@sveltejs/kit';

import type { ComponentType, SvelteComponentTyped } from 'svelte';

export const load = async ({ params, data }) => {
	const id = params.id;
	const comps = import.meta.glob<Record<string, ComponentType<SvelteComponentTyped>>>(
		'../pages/**/*.svelte'
	);

	const match = comps[`../pages/${id}.svelte`];

	if (!match) {
		throw error(404, {
			message: 'Not found'
		});
	}

	const page = (await match()).default;

	return {
		page,
		...data
	};
};
