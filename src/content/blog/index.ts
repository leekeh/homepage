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
	// AT-URI of this post's site.standard.document record on the PDS, sourced from
	// standard-site-records.json. Absent until the post has been published.
	atUri?: string;
};
