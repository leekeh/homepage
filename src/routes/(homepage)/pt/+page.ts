/** @type {import('./$types').PageServerLoad} */
import { error } from '@sveltejs/kit';

import { getResourceOverview } from './resources';

export const load = async () => {
	const resources = await getResourceOverview();
	return {
		resources
	};
};
