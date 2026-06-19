import type { Attachment } from 'svelte/attachments';

export type RovingTabindexOptions = {
	/** CSS selector used to find focusable child items within the container */
	selector: string;
	/** Navigation orientation: 'vertical' (↑↓), 'horizontal' (←→), or 'both' */
	orientation?: 'vertical' | 'horizontal' | 'both';
	/** Read the current active index from component state */
	activeIndex: () => number;
	/** Write the new active index back to component state */
	setActiveIndex: (index: number) => void;
	/**
	 * Called for keydown events not consumed by the roving logic
	 * (e.g. Escape, Tab, Enter). Arrow keys, Home, End, and Space are handled internally.
	 */
	onKeydown?: (event: KeyboardEvent) => void;
};

export type RovingTabindexControl = {
	attachment: Attachment<HTMLElement>;
	/** Move focus to the item at `index` (wraps around) */
	focusAt: (index: number) => void;
};

export function useRovingTabindex(options: RovingTabindexOptions): RovingTabindexControl {
	const orientation = options.orientation ?? 'vertical';
	let container: HTMLElement | null = null;

	function getItems(): HTMLElement[] {
		if (!container) return [];
		return Array.from(container.querySelectorAll<HTMLElement>(options.selector));
	}

	function isNativeTextEditingTarget(event: KeyboardEvent): boolean {
		const target = event.target as HTMLElement | null;
		if (!target) return false;
		if (target instanceof HTMLInputElement) return true;
		if (target instanceof HTMLTextAreaElement) return true;
		if (target.isContentEditable) return true;
		return false;
	}

	function isColorInputTarget(event: KeyboardEvent): boolean {
		const target = event.target as HTMLElement | null;
		return target instanceof HTMLInputElement && target.type === 'color';
	}

	function isSelectTarget(event: KeyboardEvent): boolean {
		const target = event.target as HTMLElement | null;
		return target instanceof HTMLSelectElement;
	}

	/** Move keyboard focus to the item at `index` (wraps around). Calls setActiveIndex. */
	function moveFocus(index: number) {
		const items = getItems();
		if (!items.length) return;
		const next = ((index % items.length) + items.length) % items.length;
		options.setActiveIndex(next);
		items[next]?.focus();
	}

	const attachment: Attachment<HTMLElement> = (element) => {
		container = element;

		/** Sync active index when an item receives focus naturally (e.g. via click or Tab) */
		function onFocusin(event: FocusEvent) {
			const items = getItems();
			const idx = items.indexOf(event.target as HTMLElement);
			if (idx !== -1) options.setActiveIndex(idx);
		}

		function onKeydown(event: KeyboardEvent) {
			const items = getItems();
			if (!items.length) return;

			const isVert = orientation === 'vertical' || orientation === 'both';
			const isHoriz = orientation === 'horizontal' || orientation === 'both';

			if (
				isNativeTextEditingTarget(event) &&
				!isSelectTarget(event) &&
				!isColorInputTarget(event)
			) {
				options.onKeydown?.(event);
				return;
			}
			const current = options.activeIndex();

			// APG toolbar guidance: for controls that use a specific arrow-key pair,
			// reserve those keys for the control and use the opposite pair for toolbar navigation.
			if (isSelectTarget(event) && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
				options.onKeydown?.(event);
				return;
			}

			if ((isVert && event.key === 'ArrowDown') || (isHoriz && event.key === 'ArrowRight')) {
				event.preventDefault();
				moveFocus(current + 1);
			} else if ((isVert && event.key === 'ArrowUp') || (isHoriz && event.key === 'ArrowLeft')) {
				event.preventDefault();
				moveFocus(current - 1);
			} else if (event.key === 'Home') {
				event.preventDefault();
				moveFocus(0);
			} else if (event.key === 'End') {
				event.preventDefault();
				moveFocus(items.length - 1);
			} else if (event.key === ' ') {
				// Space activates the current item (anchors only respond to Enter natively)
				event.preventDefault();
				items[current]?.click();
			} else {
				options.onKeydown?.(event);
			}
		}

		element.addEventListener('focusin', onFocusin);
		element.addEventListener('keydown', onKeydown);

		return () => {
			container = null;
			element.removeEventListener('focusin', onFocusin);
			element.removeEventListener('keydown', onKeydown);
		};
	};

	return { attachment, focusAt: moveFocus };
}
