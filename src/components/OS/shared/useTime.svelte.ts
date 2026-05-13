const formatter = new Intl.DateTimeFormat([], { hour: '2-digit', minute: '2-digit' });

let time = $state(formatTime());

function formatTime() {
	return formatter.format(new Date());
}

/**
 * Start the clock. Call once from onMount in the root layout.
 * Returns a cleanup function to stop the interval.
 */
export function initializeTime(): () => void {
	time = formatTime();
	const interval = setInterval(() => {
		time = formatTime();
	}, 30_000);
	return () => clearInterval(interval);
}

export function useTime() {
	return time;
}
