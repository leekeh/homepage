let isPrint = $state(false);

export function initializeIsPrint(): () => void {
	const before = () => (isPrint = true);
	const after = () => (isPrint = false);
	window.addEventListener('beforeprint', before);
	window.addEventListener('afterprint', after);
	return () => {
		window.removeEventListener('beforeprint', before);
		window.removeEventListener('afterprint', after);
	};
}

export function useIsPrint() {
	return isPrint;
}
