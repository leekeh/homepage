import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Progress } from './types';

function createStore<T>(key: string, initialValue?: T | null) {
	const prefixedKey = `webpath-${key}`;
	// Get the value from localStorage if it exists
	const cachedValue = browser && localStorage.getItem(prefixedKey);
	const initial = cachedValue ? JSON.parse(cachedValue) : initialValue;

	// Create a writable store with the initial value
	const { subscribe, set, update } = writable<T>(initial);

	// Update localStorage whenever the store value changes
	subscribe((value: T) => {
		browser && localStorage.setItem(prefixedKey, JSON.stringify(value));
	});

	// Return the store methods
	return {
		subscribe,
		set,
		update
	};
}

export const hasProgrammed = createStore<string>('hasProgrammed', null);

export const progress = createStore<Progress>('webpath-progress', {});

export const lastVisited = createStore<string>('last-visited', null);
