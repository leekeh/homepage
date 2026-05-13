export function applyPolyfills() {
	// Apply a polyfill for the HTML dialog element's command attribute, since it is fairly new.
	applyDialogCommandPolyfill();
}

function applyDialogCommandPolyfill() {
	if (typeof document === 'undefined') return;

	// check if the browser supports the command attribute
	const testButton = document.createElement('button');
	if ('command' in testButton) return;

	document.addEventListener('click', (event) => {
		const target = event.target as HTMLElement | null;
		if (!target) return;

		const dialogTrigger = target.closest<HTMLElement>('[command]');
		if (dialogTrigger) {
			const command = dialogTrigger.getAttribute('command');
			const dialogId = dialogTrigger.getAttribute('commandfor');
			if (command && dialogId) {
				const dialog = document.getElementById(dialogId);
				if (dialog instanceof HTMLDialogElement) {
					if (command === 'show-modal' || command === 'open-modal') {
						if (!dialog.open) dialog.showModal();
					} else if (command === 'close' || command === 'request-close') {
						if (dialog.open) dialog.close();
					}
				}
			}
		}
	});
}
