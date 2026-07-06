import { env } from '$env/dynamic/public';

export const SITE_NAME = env.PUBLIC_SITE_NAME || 'leekeh';
export const SITE_DESCRIPTION =
	env.PUBLIC_SITE_DESCRIPTION ||
	'Digital trinkets and personal ramblings by a Dutch web developer named Lieke.';

const rawSiteUrl = (env.PUBLIC_SITE_URL || 'https://www.leekeh.com').trim();

export const SITE_URL = rawSiteUrl.replace(/\/+$/, '');

export function absoluteUrl(pathname: string): string {
	const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
	return `${SITE_URL}${path}`;
}
