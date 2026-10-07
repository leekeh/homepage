/**
 * Resolves a free-text "credit" string to a clickable URL, or `null` if it
 * isn't one. Credits in content are often plain text (e.g. "Felicia Chiao")
 * rather than links, and some links are written without a protocol (e.g.
 * "www.reddit.com/..."), so a bare `new URL()` check isn't enough.
 */
export function resolveCreditUrl(credit: string): string | null {
	if (URL.canParse(credit)) return new URL(credit).href;

	const withProtocol = `https://${credit}`;
	if (URL.canParse(withProtocol) && new URL(withProtocol).hostname.includes('.')) {
		return new URL(withProtocol).href;
	}

	return null;
}
