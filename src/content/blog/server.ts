import type { BlogPost } from '.';
import { SITE_URL } from '../site';

type BlogMetadata = {
	title?: string;
	date?: string;
	description?: string;
	categories?: string[];
	tags?: string[];
	ogImage?: string;
	// Injected by remark-git-info
	publishedAt?: string | null;
	lastModified?: string | null;
	changelog?: string[];
	// Injected by remark-reading-time
	readingTime?: { text: string; minutes: number; words: number };
};

// Import only the metadata export from each mdx file (not the full Svelte component)
const metadataModules = import.meta.glob('./posts/**/*.mdx', {
	eager: true,
	import: 'metadata'
}) as Record<string, BlogMetadata>;

function normalizeCategory(category: string): string {
	return category.toLowerCase().trim().replace(/\s+/g, '-');
}

function getSlugFromPath(path: string): string {
	// e.g. "./posts/hello-world/hello-world.mdx" → "hello-world"
	return (
		path
			.split('/')
			.at(-1)
			?.replace(/\.mdx$/, '') ?? path
	);
}

function parsePost(path: string, meta: BlogMetadata): BlogPost | null {
	const slug = getSlugFromPath(path);

	if (!meta.title) {
		console.warn(`Blog post ${path} is missing a title, skipping`);
		return null;
	}

	// Prefer explicit frontmatter date; fall back to git's first commit date
	const date = meta.date ?? meta.publishedAt ?? null;

	if (!date) {
		console.warn(`Blog post ${path} has no date, skipping`);
		return null;
	}

	const readingTime = meta.readingTime ?? { text: '1 min read', minutes: 1 };

	return {
		slug,
		title: meta.title,
		date,
		lastModified: meta.lastModified ?? null,
		changelog: meta.changelog ?? [],
		description: meta.description ?? '',
		readingTimeText: readingTime.text,
		readingTimeMinutes: Math.max(1, Math.ceil(readingTime.minutes)),
		categories: (meta.categories ?? []).map(normalizeCategory),
		tags: (meta.tags ?? []).map((tag) => tag.toLowerCase().trim()),
		canonicalUrl: `${SITE_URL}/blog/${slug}`,
		ogImage: meta.ogImage
	};
}

export const blogPosts: BlogPost[] = Object.entries(metadataModules)
	.map(([path, meta]) => parsePost(path, meta))
	.filter((post): post is BlogPost => post !== null)
	.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export function getAllBlogPosts(): BlogPost[] {
	return blogPosts;
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
	return blogPosts.find((post) => post.slug === slug);
}

export function getBlogCategories(): string[] {
	return [...new Set(blogPosts.flatMap((post) => post.categories))].sort();
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
	return blogPosts.filter((post) => post.categories.includes(category));
}
