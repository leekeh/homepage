/** True after client hydration, false during SSR / no-JS. */
let jsSupport = $state(false);

export function enableJsSupport() {
	jsSupport = true;
}

/**
 * Returns the module-level JS support state.
 * False during SSR, true after client hydration.
 */
export function useJsSupport() {
	return jsSupport;
}
