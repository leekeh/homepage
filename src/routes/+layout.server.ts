import type { LayoutServerLoad } from "./$types";

import { getAllBlogPosts, getBlogCategories } from "../content/blog/server";

export const load: LayoutServerLoad = () => {
  return {
    blogPosts: getAllBlogPosts(),
    blogCategories: getBlogCategories(),
  };
};
