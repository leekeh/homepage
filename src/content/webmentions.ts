import { env } from "$env/dynamic/public";

const webmentionUser = env.PUBLIC_WEBMENTION_IO_USERNAME || "";

export const WEBMENTION_ENDPOINT =
  env.PUBLIC_WEBMENTION_ENDPOINT ||
  (webmentionUser ? `https://webmention.io/${webmentionUser}/webmention` : "");

export const WEBMENTION_PINGBACK =
  env.PUBLIC_WEBMENTION_PINGBACK ||
  (webmentionUser ? `https://webmention.io/${webmentionUser}/xmlrpc` : "");

export type Webmention = {
  id: string;
  authorName: string;
  authorUrl?: string;
  authorPhoto?: string;
  content?: string;
  published?: string;
  url?: string;
};

type WebmentionApiResponse = {
  children?: Array<{
    "wm-id"?: number;
    "wm-property"?: string;
    url?: string;
    published?: string;
    author?: {
      name?: string;
      url?: string;
      photo?: string;
    };
    content?: {
      text?: string;
      html?: string;
    };
  }>;
};

export async function fetchWebmentions(
  targetUrl: string,
): Promise<Webmention[]> {
  const query = new URLSearchParams({
    target: targetUrl,
    per_page: "50",
  });
  const apiUrl = `https://webmention.io/api/mentions.jf2?${query.toString()}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) return [];

    const payload = (await response.json()) as WebmentionApiResponse;

    return (payload.children ?? [])
      .filter((item) => item["wm-property"] !== "like-of")
      .map((item) => ({
        id: String(item["wm-id"] ?? item.url ?? targetUrl),
        authorName: item.author?.name || "Anonymous",
        authorUrl: item.author?.url,
        authorPhoto: item.author?.photo,
        content: item.content?.text || item.content?.html,
        published: item.published,
        url: item.url,
      }))
      .sort((a, b) => {
        const aTime = a.published ? new Date(a.published).getTime() : 0;
        const bTime = b.published ? new Date(b.published).getTime() : 0;
        return bTime - aTime;
      });
  } catch {
    return [];
  }
}
