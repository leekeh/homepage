import type { ParamMatcher } from '@sveltejs/kit';
import { folders } from '../content/folders/server';

// Restricts the root `/[id=folder]` route to known folder ids, so every
// other single/two-segment path (`/paint`, `/blog/[...slug]`, etc.) still
// falls through to its own route instead of being shadowed by this one —
// SvelteKit ranks a named param as more specific than any other dynamic
// route at the same depth, including the generic `[...path]` catch-all.
export const match: ParamMatcher = (param) => param in folders;
