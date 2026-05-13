import adapter from "@sveltejs/adapter-static";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    experimental: {
      async: true,
    },
  },
  kit: {
    adapter: adapter({
      fallback: "404.html",
    }),
    alias: {
      "@components/*": "src/components/*",
      "@icons/*": "src/icons/*",
      "@widgets/*": "src/components/widgets/*",
      "@assets/*": "Src/assets/*",
    },
  },
};

export default config;
