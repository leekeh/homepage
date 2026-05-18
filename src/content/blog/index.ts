import type { PathnameWithSearchOrHash } from '$app/types';

export type BlogPost = {
	slug: string;
	title: string;
	date: string;
	description: string;
	excerpt: string;
	html: string;
	readingTimeText: string;
	readingTimeMinutes: number;
	categories: string[];
	tags: string[];
	canonicalUrl: PathnameWithSearchOrHash;
	ogImage?: string;
};
