import type { BlogPost } from './blog';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from './site';

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function asRfc822(dateString: string): string {
	return new Date(dateString).toUTCString();
}

export function generateRssXml(options: {
	title: string;
	description: string;
	path: string;
	posts: BlogPost[];
}): string {
	const feedUrl = `${SITE_URL}${options.path}`;
	const items = options.posts
		.map((post) => {
			const categories = post.categories
				.map((category) => `<category>${escapeXml(category)}</category>`)
				.join('\n');

			return `<item>
<title>${escapeXml(post.title)}</title>
<link>${escapeXml(post.canonicalUrl)}</link>
<guid>${escapeXml(post.canonicalUrl)}</guid>
<pubDate>${asRfc822(post.date)}</pubDate>
<description>${escapeXml(post.description)}</description>
${categories}
</item>`;
		})
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${escapeXml(options.title)}</title>
<link>${escapeXml(SITE_URL)}</link>
<description>${escapeXml(options.description)}</description>
<atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
<language>en</language>
<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
</channel>
</rss>`;
}

export const defaultFeedMeta = {
	title: `${SITE_NAME} Blog`,
	description: SITE_DESCRIPTION
};
