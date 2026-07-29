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

// Auto-discover og.png files placed alongside each post (e.g. posts/hello-world/og.png)
const ogImageModules = import.meta.glob<string>('./posts/**/og.png', {
	eager: true,
	query: '?url',
	import: 'default'
});

// Map from post slug (== path under posts/, minus filename) → Vite-processed asset URL
const autoOgImageBySlug: Record<string, string> = Object.fromEntries(
	Object.entries(ogImageModules).map(([path, url]) => {
		return [getSlugFromPath(path), url];
	})
);

function normalizeCategory(category: string): string {
	return category.toLowerCase().trim().replace(/\s+/g, '-');
}

function getSlugFromPath(path: string): string {
	// The slug is the post's directory path relative to posts/, so nested posts
	// keep their folders in the URL. The redundant filename segment is dropped.
	// e.g. "./posts/hello-world/hello-world.mdx"            → "hello-world"
	//      "./posts/indie-web/webmentions/webmentions.mdx"  → "indie-web/webmentions"
	//      "./posts/indie-web/webmentions/og.png"           → "indie-web/webmentions"
	const afterPosts = path.split('/posts/').at(-1) ?? path;
	return afterPosts.split('/').slice(0, -1).join('/');
}

function parsePost(path: string, meta: BlogMetadata): BlogPost | null {
	const slug = getSlugFromPath(path);

	if (!meta.title) {
		console.warn(`Blog post ${path} is missing a title, skipping`);
		return null;
	}

	// Prefer explicit frontmatter date; fall back to git's first commit date
	const date = meta.date ?? meta.publishedAt ?? new Date().toISOString();

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
		ogImage: meta.ogImage ?? autoOgImageBySlug[slug]
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
