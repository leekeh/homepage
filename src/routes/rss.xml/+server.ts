import { getAllBlogPosts } from "../../content/blog/server";
import { defaultFeedMeta, generateRssXml } from "../../content/rss";

export const prerender = true;

export function GET() {
  const xml = generateRssXml({
    title: defaultFeedMeta.title,
    description: defaultFeedMeta.description,
    path: "/rss.xml",
    posts: getAllBlogPosts(),
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "max-age=0, s-maxage=3600",
    },
  });
}
