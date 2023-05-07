import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';

function createStore(key: string, initialValue?: string | boolean | object | null) {
	const prefacedKey = `webpath-${key}`;
	// Get the value from localStorage if it exists
	const cachedValue = browser && localStorage.getItem(prefacedKey);
	const initial = cachedValue ? JSON.parse(cachedValue) : initialValue;

	// Create a writable store with the initial value
	const { subscribe, set, update } = writable(initial);

	// Update localStorage whenever the store value changes
	subscribe((value) => {
		browser && localStorage.setItem(prefacedKey, JSON.stringify(value));
	});

	// Return the store methods
	return {
		subscribe,
		set,
		update
	};
}

export const hasProgrammed: Writable<string> = createStore('hasProgrammed', null);
