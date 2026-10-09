import { defineParams } from '@sveltejs/kit/params';

// This module is loaded three ways: SvelteKit's build-time param validation
// (a plain Node import of this exact source file), the server bundle, and
// the client bundle (the client-side router evaluates matchers too, to
// decide route ids during in-app navigation). `import.meta.glob` is a
// Vite-only, build-time macro — Vite statically transforms this call into
// real imports wherever it bundles (client and server alike), while plain
// Node (the first case) has no such transform, so `import.meta.glob` is
// just `undefined` there; calling it throws an ordinary, catchable error.
function listFolderIds(): Set<string> {
	try {
		const folderModules = import.meta.glob('./content/folders/*/folder.ts', { eager: true });
		return new Set(
			Object.keys(folderModules).map((path) => path.split('/').slice(0, -1).pop() ?? path)
		);
	} catch {
		return new Set();
	}
}

const folderIds = listFolderIds();

// Restricts the root `/[id=folder]` route to known folder ids, so every
// other single/two-segment path (`/paint`, `/blog/[...slug]`, etc.) still
// falls through to its own route instead of being shadowed by this one —
// SvelteKit ranks a named param as more specific than any other dynamic
// route at the same depth, including the generic `[...path]` catch-all.
export const params = defineParams({
	folder: (param) => (folderIds.has(param) ? param : undefined)
});
