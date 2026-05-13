import { createContext } from 'svelte';

const [getUserContext, setUserContext] = createContext<boolean>();

export function initializeJsSupport() {
	setUserContext(false);
}

export function enableJsSupport() {
	setUserContext(true);
}

/**
 * Reusable hook to access the global JS support state.
 * Returns the shared state object initialized in the layout.
 * Returns false during SSR, true after client hydration.
 *
 * Usage:
 * ```
 * const hasJsSupport = useJsSupport();
 * {#if hasJsSupport}
 *   <!-- JS-dependent content -->
 * {:else}
 *   <!-- Fallback for no-JS -->
 * {/if}
 * ```
 */
export function useJsSupport() {
	return getUserContext();
}
