const SQUIGGLE_PREF_KEY = 'homepage.squiggles.enabled';

let squigglesEnabled = $state(true);

function applySquigglesPreference(enabled: boolean) {
	if (typeof document === 'undefined') return;
	document.documentElement.dataset.squiggles = enabled ? 'on' : 'off';
}

export function initializeSquiggles() {
	const stored = localStorage.getItem(SQUIGGLE_PREF_KEY);
	squigglesEnabled = stored !== 'false';
	applySquigglesPreference(squigglesEnabled);
}

export function setSquigglesEnabled(enabled: boolean) {
	squigglesEnabled = enabled;
	applySquigglesPreference(enabled);
	localStorage.setItem(SQUIGGLE_PREF_KEY, enabled ? 'true' : 'false');
}

export function toggleSquiggles() {
	setSquigglesEnabled(!squigglesEnabled);
}

export function useSquiggles() {
	return squigglesEnabled;
}
