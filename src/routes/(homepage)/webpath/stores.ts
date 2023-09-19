import { createCachedStore } from '@util';
import type { Progress } from './types';

const prefixedKey = (key: string) => `webpath-${key}`;

export const hasProgrammed = createCachedStore<string>(prefixedKey('hasProgrammed'), null);

export const progress = createCachedStore<Progress>(prefixedKey('webpath-progress'), {});

export const lastVisited = createCachedStore<string>(prefixedKey('last-visited'), null);
