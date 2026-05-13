import { getAllWidgets } from "../../components/widgets/widgets";

const blogPostModules = import.meta.glob("../../content/blog/posts/*.md", {
  query: "?raw",
  import: "default",
});

function getBlogPostPaths(): string[] {
  return Object.keys(blogPostModules).map((path) => {
    const slug = path.split("/").at(-1)?.replace(/\.md$/, "") ?? path;
    return `/blog/${slug}`;
  });
}

export const prerender = true;

export function entries() {
  const staticPaths = getAllWidgets()
    .map((widget) => widget.route)
    .filter((route) => route !== "/" && !route.includes("["));

  const blogPostPaths = getBlogPostPaths();

  return [...new Set([...staticPaths, ...blogPostPaths])].map((fullPath) => ({
    path: fullPath.replace(/^\//, ""),
  }));
}
