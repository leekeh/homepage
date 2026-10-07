import { describe, expect, it } from 'vitest';
import { WindowManager } from './windowManager.svelte';

describe('WindowManager.open — replaceWindowId', () => {
	it('updates the named window in place instead of opening a new one', () => {
		const wm = new WindowManager();
		const first = wm.open('photoviewer', {
			data: { id: 'cute-pictures', photoId: 'whiskers-nap' }
		});
		const second = wm.open('photoviewer', {
			data: { id: 'cute-pictures', photoId: 'biscuit-ears' },
			replaceWindowId: first
		});

		expect(second).toBe(first);
		expect(wm.windows).toHaveLength(1);
		expect(wm.windows[0].data).toEqual({ id: 'cute-pictures', photoId: 'biscuit-ears' });
	});

	it('keeps the replaced window focused on top', () => {
		const wm = new WindowManager();
		wm.open('about');
		const photoWindowId = wm.open('photoviewer', {
			data: { id: 'cute-pictures', photoId: 'whiskers-nap' }
		});
		wm.open('photoviewer', {
			data: { id: 'cute-pictures', photoId: 'biscuit-ears' },
			replaceWindowId: photoWindowId
		});

		expect(wm.activeWindow?.id).toBe(photoWindowId);
	});

	it('falls back to opening a new window if the named window no longer exists', () => {
		const wm = new WindowManager();
		const id = wm.open('photoviewer', {
			data: { id: 'cute-pictures', photoId: 'whiskers-nap' }
		});
		wm.close(id);

		const second = wm.open('photoviewer', {
			data: { id: 'cute-pictures', photoId: 'biscuit-ears' },
			replaceWindowId: id
		});

		expect(second).not.toBe(id);
		expect(wm.windows).toHaveLength(1);
	});

	it('without replaceWindowId, still stacks a separate window per distinct data', () => {
		// Explicitly opening a different item (not via prev/next) is allowed to
		// stack — only an explicit replaceWindowId collapses windows.
		const wm = new WindowManager();
		wm.open('photoviewer', { data: { id: 'cute-pictures', photoId: 'whiskers-nap' } });
		wm.open('photoviewer', { data: { id: 'cute-pictures', photoId: 'biscuit-ears' } });

		expect(wm.windows).toHaveLength(2);
	});

	it('leaves other widgets stacking per distinct data', () => {
		const wm = new WindowManager();
		wm.open('treatdetail', { data: { id: 'cinnamon-bun' } });
		wm.open('treatdetail', { data: { id: 'fig-danish' } });

		expect(wm.windows).toHaveLength(2);
	});
});
