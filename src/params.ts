import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineParams } from '@sveltejs/kit/params';

// This module is loaded three ways: SvelteKit's build-time param validation
// (a plain Node import of this exact source file), the server bundle, and
// the client bundle — the client-side router evaluates matchers too, to
// decide route ids during in-app navigation — the last of which has no
// filesystem. The try/catch keeps that context from crashing the whole
// page on load; folder links there are resolved by the app's own
// widget-router instead (see WindowProvider.svelte), so an empty fallback
// here never surfaces as a visible bug.
function listFolderIds(): Set<string> {
	try {
		return new Set(
			readdirSync(resolve(process.cwd(), 'src/content/folders'), { withFileTypes: true })
				.filter((entry) => entry.isDirectory())
				.map((entry) => entry.name)
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
