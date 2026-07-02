export function formatDate(dateStr: string) {
	return new Date(dateStr).toLocaleDateString('en-GB', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC'
	});
}
