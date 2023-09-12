import { writable } from 'svelte/store';

export const isTablet = writable(false);
export const isDesktop = writable(false);
export const isLargeScreen = writable(false);

export const platform = writable('Unknown');
