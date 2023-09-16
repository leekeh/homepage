import { createCachedStore } from '@util';

export const startDateStore = createCachedStore<Date | null>('75-hard-start-date', null);

export const ruleStore = createCachedStore<string[]>('75-hard-rules', [
	'Follow a diet',
	'2 x 45 workouts',
	'Drink a gallon of water',
	'Read 10 pages of nonfiction',
	'Take a progress picture'
]);
