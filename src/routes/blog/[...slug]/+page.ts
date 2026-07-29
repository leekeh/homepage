import type { PageLoad } from './$types';
import type { Component } from 'svelte';
import { error } from '@sveltejs/kit';

export type PostMetadata = {
	title?: string;
	date?: string;
	description?: string;
	categories?: string[];
	tags?: string[];
	lastModified?: string | null;
	changelog?: string[];
	readingTime?: { text: string; minutes: number };
};

const postModules = import.meta.glob<{ default: Component; metadata: PostMetadata }>(
	'../../../content/blog/posts/**/*.mdx'
);

// Map from slug (== post's directory path under posts/, matching getSlugFromPath
// in content/blog/server.ts) → module loader, so nested posts keep their folders
// in the URL and resolve correctly.
const postLoadersBySlug = Object.fromEntries(
	Object.entries(postModules).map(([path, loader]) => {
		const afterPosts = path.split('/posts/').at(-1)!;
		const slug = afterPosts.split('/').slice(0, -1).join('/');
		return [slug, loader];
	})
);

export const load: PageLoad = async ({ params, data }) => {
	const { slug } = params;
	const loader = postLoadersBySlug[slug];
	if (!loader) error(404, 'Post not found');
	const { default: PostComponent, metadata } = await loader();
	return { slug, PostComponent, metadata, initialComments: data.initialComments };
};
