import {
	PUBLIC_WEBMENTION_ENDPOINT,
	PUBLIC_WEBMENTION_IO_USERNAME,
	PUBLIC_WEBMENTION_PINGBACK
} from '$app/env/public';

const webmentionUser = PUBLIC_WEBMENTION_IO_USERNAME || '';

export const WEBMENTION_ENDPOINT =
	PUBLIC_WEBMENTION_ENDPOINT ||
	(webmentionUser ? `https://webmention.io/${webmentionUser}/webmention` : '');

export const WEBMENTION_PINGBACK =
	PUBLIC_WEBMENTION_PINGBACK ||
	(webmentionUser ? `https://webmention.io/${webmentionUser}/xmlrpc` : '');
