/** @type {import('./$types').PageServerLoad} */
import { error } from '@sveltejs/kit';
import type { PostMetaData } from '../../types';

export const load = async ({ url, params }) => {
	const lang =
		params.lang && ['en', 'nl'].includes(params.lang) ? (params.lang as 'nl' | 'en') : 'en';
	const id = url.pathname.slice(url.pathname.lastIndexOf('/') + 1);
	for (const [key, value] of Object.entries(
		import.meta.glob<Record<string, any>>('./**/*.svelte')
	)) {
		if (key.endsWith(`${id}/+page.svelte`)) {
			const module = await value();
			const category = key.slice(0, key.lastIndexOf(`)`)).slice(key.lastIndexOf('(') + 1);
			const { creationDate, imageSrc, editDate, ...metadata } = module.metadata as PostMetaData;
			const langSpecificProps = metadata[lang];
			return {
				creationDate,
				imageSrc,
				id,
				category,
				editDate,
				...langSpecificProps,
				lang
			};
		}
	}

	throw error(404, {
		message: 'Not found'
	});
};
