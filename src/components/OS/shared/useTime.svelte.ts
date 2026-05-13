import { createContext } from 'svelte';

const [getTime, setTime] = createContext<string>();

function updateClock() {
	setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
}

export function initializeTime() {
	updateClock();
	// FIXME i'm not allowed to run outside initialization,
	// const interval = setInterval(updateClock, 30_000);
	// return () => clearInterval(interval);
}

export function useTime() {
	return getTime();
}
