import { resolve } from '$app/paths';
import type { PathnameWithSearchOrHash, ResolvedPathname } from '$app/types';

/**
 * Base-path-aware wrapper around `resolve()` from `$app/paths` for
 * routes computed at runtime.
 *
 * `resolve()` is typed to accept a *single, concrete* route literal — its
 * `ResolveArgs<T>` is a distributive conditional, so a value typed as the
 * broad `PathnameWithSearchOrHash` union (a widget's configured route, a
 * window's built path, etc.) never matches, even though it is always an
 * already-built, valid pathname. Literal call sites (`resolve('/blog')`) are
 * fine and should keep calling `resolve()` directly; use this only for the
 * dynamic cases.
 *
 * The `as '/'` cast is type-only: it collapses the union to one concrete
 * member so the generic resolves, while the real (runtime) value is passed
 * through unchanged.
 */
export function resolvePath(path: PathnameWithSearchOrHash): ResolvedPathname {
	return resolve(path as '/');
}
