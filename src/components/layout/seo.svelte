<script lang="ts">
	import type { LayoutData } from '../../routes/$types';

	import { page } from '$app/state';
	import {
		getRouteForWindow,
		getWidgetById,
		getWidgetByRoute
	} from '../../components/widgets/widgets';
	import { useWindowManager } from '../OS/shared/windowManager.svelte';
	import { getTreatById, posterWebp } from '../../components/widgets/treats/data';
	import {
		getFolderMeta,
		getPhotoById,
		getPhotosByFolder,
		photoFilename,
		photoSrc
	} from '../../content/folders/data';
	import {
		absoluteUrl,
		DEFAULT_OG_IMAGE,
		SITE_AUTHOR,
		SITE_DESCRIPTION,
		SITE_LOCALE,
		SITE_NAME
	} from '../../content/site';
	import { WEBMENTION_ENDPOINT, WEBMENTION_PINGBACK } from '../../content/webmentions';
	import {
		STANDARD_SITE_PUBLICATION,
		hasStandardSitePublication
	} from '../../content/standard-site';

	// get generated type from route
	type Props = {
		data: LayoutData;
	};
	let { data }: Props = $props();

	const wm = useWindowManager();
	const currentPath = $derived(page.url.pathname);

	// The window manager drives client-side navigation via pushState, which
	// (by design, per SvelteKit's shallow-routing semantics) does NOT update
	// `page.url` — so after the first load, `page.url` can be stale while the
	// desktop has already moved on to a different window. The active window
	// is the actual source of truth for "what's currently shown"; `page.url`
	// is only needed as a fallback before any window has been seeded (SSR
	// first paint, or genuinely no-JS clients that never open one via `wm`).
	const routeMatch = $derived(getWidgetByRoute(currentPath));
	const activeWindowMatch = $derived.by(() => {
		const active = wm.activeWindow;
		if (!active) return undefined;
		const widget = getWidgetById(active.widgetId);
		if (!widget) return undefined;
		return { widget, params: active.data as Record<string, string> | undefined };
	});
	const currentMatch = $derived(activeWindowMatch ?? routeMatch);
	// The canonical/OG url for the resolved widget — not just `currentPath`,
	// for the same reason as above.
	const currentRoute = $derived(
		currentMatch?.widget
			? getRouteForWindow(currentMatch.widget.id, currentMatch.params)
			: currentPath
	);
	const pageTitle = $derived.by(() => {
		const rootTitle = 'leekeh';
		if (!currentMatch?.widget || currentMatch.widget.id === 'about') return rootTitle;
		const currentSlug = currentMatch.params?.slug;
		if (currentMatch.widget.id === 'blogpost' && currentSlug) {
			return data.blogPosts.find((post) => post.slug === currentSlug)?.title ?? 'Blog Post';
		}
		return `${currentMatch.widget.title} - ${rootTitle}`;
	});

	const currentPost = $derived.by(() => {
		const currentSlug = currentMatch?.params?.slug;
		if (currentMatch?.widget.id !== 'blogpost' || !currentSlug) {
			return undefined;
		}
		return data.blogPosts.find((post) => post.slug === currentSlug);
	});

	const currentTreat = $derived.by(() => {
		const id = currentMatch?.params?.id;
		if (currentMatch?.widget.id !== 'treatdetail' || !id) {
			return undefined;
		}
		return getTreatById(id);
	});

	const currentPhoto = $derived.by(() => {
		const id = currentMatch?.params?.id;
		const photoId = currentMatch?.params?.photoId;
		if (currentMatch?.widget.id !== 'photoviewer' || !id || !photoId) {
			return undefined;
		}
		return getPhotoById(id, photoId);
	});

	const currentFolder = $derived.by(() => {
		const id = currentMatch?.params?.id;
		if (currentMatch?.widget.id !== 'folderdetail' || !id) {
			return undefined;
		}
		const meta = getFolderMeta(id);
		return meta ? { id, meta } : undefined;
	});

	const seo = $derived.by(() => {
		if (currentFolder) {
			const cover = getPhotosByFolder(currentFolder.id)[0];
			return {
				title: `${currentFolder.meta.title} - leekeh`,
				description: currentFolder.meta.description ?? 'A folder of cute pictures.',
				type: 'website' as const,
				url: absoluteUrl(currentRoute),
				image: absoluteUrl(cover ? photoSrc(cover) : DEFAULT_OG_IMAGE),
				imageAlt: currentFolder.meta.title,
				article: undefined
			};
		}

		if (currentPhoto) {
			// `alt` is authored empty for some folders (e.g. personal photo dumps
			// with no individual descriptions yet) — `??` wouldn't fall through
			// past an empty string, and an empty meta description fails SEO
			// audits, so fall back to the folder title instead.
			const folderTitle = getFolderMeta(currentMatch?.params?.id ?? '')?.title;
			return {
				title: `${photoFilename(currentPhoto)} - leekeh`,
				description:
					currentPhoto.caption || currentPhoto.alt || `A photo from ${folderTitle ?? 'leekeh'}.`,
				type: 'website' as const,
				url: absoluteUrl(currentRoute),
				image: absoluteUrl(photoSrc(currentPhoto)),
				imageAlt: currentPhoto.alt,
				article: undefined
			};
		}

		if (currentTreat) {
			const review = currentTreat.review;
			return {
				title: `${currentTreat.title} - leekeh`,
				description:
					review.length > 155
						? `${review.slice(0, 152)}…`
						: review || 'A sweet treat, scanned in 3D.',
				type: 'article' as const,
				url: absoluteUrl(currentRoute),
				image: absoluteUrl(posterWebp(currentTreat.imgId)),
				imageAlt: currentTreat.title,
				article: {
					publishedTime: new Date(currentTreat.date).toISOString(),
					modifiedTime: undefined,
					section: 'Sweet Treats' as string | undefined,
					tags: [] as string[]
				}
			};
		}

		if (currentPost) {
			return {
				title: `${currentPost.title} - leekeh`,
				description: currentPost.description,
				type: 'article' as const,
				url: currentPost.canonicalUrl,
				image: absoluteUrl(currentPost.ogImage ?? DEFAULT_OG_IMAGE),
				imageAlt: currentPost.title,
				article: {
					publishedTime: new Date(currentPost.date).toISOString(),
					modifiedTime: currentPost.lastModified
						? new Date(currentPost.lastModified).toISOString()
						: undefined,
					section: currentPost.categories[0] as string | undefined,
					tags: currentPost.tags
				}
			};
		}

		const widget = currentMatch?.widget;
		return {
			title: pageTitle,
			description: widget?.description ?? SITE_DESCRIPTION,
			type: 'website' as const,
			url: absoluteUrl(currentRoute),
			image: absoluteUrl(widget?.ogImage ?? DEFAULT_OG_IMAGE),
			imageAlt: (widget?.title as string | undefined) ?? SITE_NAME,
			article: undefined
		};
	});
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<meta name="author" content={SITE_AUTHOR} />
	<link rel="canonical" href={seo.url} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content={SITE_LOCALE} />
	<meta property="og:title" content={seo.title} />
	<meta property="og:description" content={seo.description} />
	<meta property="og:type" content={seo.type} />
	<meta property="og:url" content={seo.url} />
	{#if seo.image}
		<meta property="og:image" content={seo.image} />
		{#if seo.imageAlt}
			<meta property="og:image:alt" content={seo.imageAlt} />
		{/if}
	{/if}
	{#if seo.article}
		<meta property="article:published_time" content={seo.article.publishedTime} />
		{#if seo.article.modifiedTime}
			<meta property="article:modified_time" content={seo.article.modifiedTime} />
		{/if}
		{#if seo.article.section}
			<meta property="article:section" content={seo.article.section} />
		{/if}
		{#each seo.article.tags as tag (tag)}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={seo.title} />
	<meta name="twitter:description" content={seo.description} />
	{#if seo.image}
		<meta name="twitter:image" content={seo.image} />
		{#if seo.imageAlt}
			<meta name="twitter:image:alt" content={seo.imageAlt} />
		{/if}
	{/if}
	<link rel="alternate" type="application/rss+xml" title="leekeh blog feed" href="/rss.xml" />
	{#if hasStandardSitePublication}
		<link rel="site.standard.publication" href={STANDARD_SITE_PUBLICATION} />
		{#if currentPost?.atUri}
			<link rel="site.standard.document" href={currentPost.atUri} />
		{/if}
	{/if}
	{#if WEBMENTION_ENDPOINT}
		<link rel="webmention" href={WEBMENTION_ENDPOINT} />
	{/if}
	{#if WEBMENTION_PINGBACK}
		<link rel="pingback" href={WEBMENTION_PINGBACK} />
	{/if}
</svelte:head>
