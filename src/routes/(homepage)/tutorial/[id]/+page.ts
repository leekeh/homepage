/** @type {import('./$types').PageServerLoad} */
import { error } from '@sveltejs/kit';

import type { ComponentType, SvelteComponentTyped } from 'svelte';

// export default {
// 	introduction: { title: 'Introduction', isOptional: false },
// 	temp2: { title: 'Temp 2', isOptional: true }
// } as const;

export const load = async ({ params }) => {
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
		title: 'dd'
	};
};
