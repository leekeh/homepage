import matter from "gray-matter";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import type { BlogPost } from ".";
import { SITE_URL } from "../site";
import { rehypeExcerpt } from "./rehype-excerpt";
import { remarkReadingTime } from "./remark-reading-time";

type BlogFrontmatter = {
  title: string;
  date: string | Date;
  description?: string;
  categories?: string[];
  tags?: string[];
  ogImage?: string;
};

type ReadingTimeData = {
  text: string;
  minutes: number;
};

const markdownModules = import.meta.glob("./posts/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const markdownProcessor = unified()
  .use(remarkParse)
  .use(remarkReadingTime)
  .use(remarkRehype)
  .use(rehypeExcerpt, { maxLength: 220 })
  .use(rehypeStringify);

function getSlugFromPath(path: string): string {
  return path.split("/").at(-1)?.replace(/\.md$/, "") ?? path;
}

function normalizeCategory(category: string): string {
  return category.toLowerCase().trim().replace(/\s+/g, "-");
}

function sanitizeText(value: string | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function parsePost(path: string, markdown: string): BlogPost {
  const slug = getSlugFromPath(path);
  const { data, content } = matter(markdown);
  const frontmatter = data as Partial<BlogFrontmatter>;
  const dateValue =
    frontmatter.date instanceof Date
      ? frontmatter.date.toISOString().slice(0, 10)
      : String(frontmatter.date ?? "");

  if (!frontmatter.title || !dateValue) {
    throw new Error(`Missing required frontmatter in blog post: ${path}`);
  }

  const parsed = markdownProcessor.processSync(content);
  const excerptFromPlugin =
    typeof parsed.data.excerpt === "string" ? parsed.data.excerpt : "";
  const excerpt =
    sanitizeText(frontmatter.description) || sanitizeText(excerptFromPlugin);
  const readingStats =
    (parsed.data.readingTime as ReadingTimeData | undefined) ??
    ({ text: "1 min read", minutes: 1 } as const);

  return {
    slug,
    title: frontmatter.title,
    date: dateValue,
    description: excerpt,
    excerpt,
    html: String(parsed),
    readingTimeText: readingStats.text,
    readingTimeMinutes: Math.max(1, Math.ceil(readingStats.minutes)),
    categories: (frontmatter.categories ?? []).map(normalizeCategory),
    tags: (frontmatter.tags ?? []).map((tag) => tag.toLowerCase().trim()),
    canonicalUrl: `${SITE_URL}/blog/${slug}`,
    ogImage: frontmatter.ogImage,
  };
}

export const blogPosts: BlogPost[] = Object.entries(markdownModules)
  .map(([path, markdown]) => parsePost(path, markdown))
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
  const normalized = normalizeCategory(category);
  return blogPosts.filter((post) => post.categories.includes(normalized));
}
