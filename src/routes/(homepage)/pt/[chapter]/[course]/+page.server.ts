/** @type {import('./$types').PageServerLoad} */
import { error } from '@sveltejs/kit';

import { getResource } from '../../resources';

export const load = async ({ params: { chapter, course } }) => {
	const resources = await getResource(chapter, course);
	if (!resources) {
		error(404, 'Course not found');
	}
	return {
		resources
	};
};
