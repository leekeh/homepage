import { env } from "$env/dynamic/public";

export const SITE_NAME = env.PUBLIC_SITE_NAME || "leekeh";
export const SITE_DESCRIPTION =
  env.PUBLIC_SITE_DESCRIPTION ||
  "Personal site of Lieke - developer, creative coder, accessibility advocate.";

const rawSiteUrl = (env.PUBLIC_SITE_URL || "http://localhost:5173").trim();

export const SITE_URL = rawSiteUrl.replace(/\/+$/, "");

export function absoluteUrl(pathname: string): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE_URL}${path}`;
}
