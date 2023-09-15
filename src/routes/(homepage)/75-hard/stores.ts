import { createCachedStore } from '@util';

export const startDateStore = createCachedStore<Date | null>('75-hard-start-date', null);
