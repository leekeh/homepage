import {
  getBlogCategories,
  getBlogPostsByCategory,
} from "../../../content/blog/server";
import { generateRssXml } from "../../../content/rss";

export const prerender = true;

export function entries() {
  return getBlogCategories().map((category) => ({ category }));
}

export function GET({ params }: { params: { category: string } }) {
  const posts = getBlogPostsByCategory(params.category);

  if (posts.length === 0) {
    return new Response("Category feed not found", { status: 404 });
  }

  const xml = generateRssXml({
    title: `leekeh Blog (${params.category})`,
    description: `Posts in the ${params.category} category`,
    path: `/rss/${params.category}.xml`,
    posts,
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "max-age=0, s-maxage=3600",
    },
  });
}
