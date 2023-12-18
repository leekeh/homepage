/** @type {import('./$types').PageServerLoad} */
import { error } from '@sveltejs/kit';
import type { PostMetaData } from './types';

export const load = async ({ params }) => {
	const lang =
		params.lang && ['en', 'nl'].includes(params.lang) ? (params.lang as 'nl' | 'en') : 'en';

	const posts = await Promise.all(
		Object.entries(import.meta.glob<Record<string, any>>('./**/+page.svelte')).map(
			async ([key, value]) => {
				const module = await value();
				const category = key.slice(0, key.lastIndexOf(`)`)).slice(key.lastIndexOf('(') + 1);
				const metadata = module.metadata;
				if (!metadata) return;
				const { creationDate, imageSrc, editDate, ...langMetadata } = metadata as PostMetaData;
				const langSpecificProps = langMetadata[lang];
				return {
					creationDate,
					imageSrc,
					category,
					editDate,
					...langSpecificProps,
					lang
				};
			}
		)
	);
	return { posts };
};
