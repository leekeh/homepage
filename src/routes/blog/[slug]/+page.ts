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

export const load: PageLoad = async ({ params, data }) => {
	const { slug } = params;
	const loader = postModules[`../../../content/blog/posts/${slug}/${slug}.mdx`];
	if (!loader) error(404, 'Post not found');
	const { default: PostComponent, metadata } = await loader();
	return { slug, PostComponent, metadata, initialComments: data.initialComments };
};
