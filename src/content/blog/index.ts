export type BlogPost = {
	slug: string;
	title: string;
	date: string;
	lastModified: string | null;
	changelog: string[];
	description: string;
	readingTimeText: string;
	readingTimeMinutes: number;
	categories: string[];
	tags: string[];
	canonicalUrl: string;
	ogImage?: string;
};
