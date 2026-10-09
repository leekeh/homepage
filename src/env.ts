import { defineEnvVars } from '@sveltejs/kit/env';

// All optional with runtime-configurable values (Cloudflare Pages env vars
// differ between preview/production deploys using the same build), so each
// falls back to `undefined` rather than failing when unset.
const optionalPublicString = (value: string | undefined) => value || undefined;

export const variables = defineEnvVars({
	PUBLIC_SITE_URL: { public: true, schema: optionalPublicString },
	PUBLIC_WEBMENTION_IO_USERNAME: { public: true, schema: optionalPublicString },
	PUBLIC_WEBMENTION_ENDPOINT: { public: true, schema: optionalPublicString },
	PUBLIC_WEBMENTION_PINGBACK: { public: true, schema: optionalPublicString }
});
