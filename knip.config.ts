import type { KnipConfig } from 'knip';

// Extracts imports from <script> blocks so mdsvex posts (.mdx/.md) are
// traced the same way knip already traces .svelte files — otherwise every
// Svelte component only ever imported from a blog post looks unused.
const scriptImports = (text: string) =>
	[...text.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map((match) => match[1]).join(';\n');

const config: KnipConfig = {
	entry: [
		// Read directly by `lhci autorun`, not imported by app code.
		'lighthouserc.cjs',
		// SvelteKit 3's env/params modules (`defineEnvVars`/`defineParams`) are
		// loaded by convention via the SvelteKit vite plugin, not an explicit
		// import, so knip's SvelteKit plugin doesn't see them as reachable.
		'src/env.ts',
		'src/params.ts'
	],
	// Only 'mdx' for now — there are no plain .md posts with <script> blocks
	// yet, and registering 'md' here would pull root docs (README.md,
	// AGENTS.md) into the analyzed project files as false "unused files".
	compilers: {
		mdx: scriptImports
	},
	ignoreDependencies: [
		// Not imported by name — svelte-check's `--tsgo` flag resolves TS7
		// via this exact alias convention (see its own error message).
		// Removing it breaks `pnpm run check`.
		'@typescript/native'
	]
};

export default config;
