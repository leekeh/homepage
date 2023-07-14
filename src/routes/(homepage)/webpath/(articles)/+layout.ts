/** @type {import('./$types').PageServerLoad} */
import { error } from '@sveltejs/kit';

import pageMap from './pageMap';
import type { PageMetaData, Progress } from '../types';
import { progress } from '../stores';
const pagesArray = pageMap.map((section) => section.pages).flat();

/** Add entries for all exercises in metadata */
const syncExercises = (originalEntry: Progress[0], exercises: PageMetaData['exercises']) => {
	if (!exercises) return originalEntry;
	const result = originalEntry?.exercises ?? {};
	Object.keys(exercises).forEach((exercise) => {
		result[exercise] = {
			answer: originalEntry?.exercises?.[exercise].answer,
			completed: originalEntry?.exercises?.[exercise].completed ?? false
		};
	});
	return { read: originalEntry?.read ?? false, exercises: result };
};

export const load = async ({ url }) => {
	const id = url.pathname.slice(url.pathname.lastIndexOf('/') + 1);

	const index = pagesArray.findIndex((page) => page.url === id);

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

			progress.update((state) => ({
				...state,
				[id]: syncExercises(state[id], metadata?.exercises)
			}));

			const previous = pagesArray[index - 1];
			const next = pagesArray[index + 1];
			const title = pagesArray[index].title;

			return {
				metadata,
				next,
				previous,
				title,
				id
			};
		}
	}

	throw error(404, {
		message: 'Not found'
	});
};
