<script lang="ts">
	import type { LayoutData } from '../routes/$types';

	import { page } from '$app/state';
	import { getWidgetByRoute } from '../components/widgets/widgets';
	import { absoluteUrl, SITE_DESCRIPTION } from '../content/site';
	import { WEBMENTION_ENDPOINT, WEBMENTION_PINGBACK } from '../content/webmentions';

	// get generated type from route
	type Props = {
		data: LayoutData;
	};
	let { data }: Props = $props();

	const currentPath = $derived(page.url.pathname);
	const currentMatch = $derived(getWidgetByRoute(currentPath));
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

	const seo = $derived.by(() => {
		if (currentPost) {
			return {
				title: `${currentPost.title} - leekeh`,
				description: currentPost.description,
				type: 'article',
				url: currentPost.canonicalUrl,
				image: currentPost.ogImage ? absoluteUrl(currentPost.ogImage) : undefined
			};
		}

		return {
			title: pageTitle,
			description: SITE_DESCRIPTION,
			type: 'website',
			url: absoluteUrl(currentPath),
			image: undefined
		};
	});
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<link rel="canonical" href={seo.url} />
	<meta property="og:title" content={seo.title} />
	<meta property="og:description" content={seo.description} />
	<meta property="og:type" content={seo.type} />
	<meta property="og:url" content={seo.url} />
	{#if seo.image}
		<meta property="og:image" content={seo.image} />
	{/if}
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={seo.title} />
	<meta name="twitter:description" content={seo.description} />
	{#if seo.image}
		<meta name="twitter:image" content={seo.image} />
	{/if}
	<link rel="alternate" type="application/rss+xml" title="leekeh blog feed" href="/rss.xml" />
	{#if WEBMENTION_ENDPOINT}
		<link rel="webmention" href={WEBMENTION_ENDPOINT} />
	{/if}
	{#if WEBMENTION_PINGBACK}
		<link rel="pingback" href={WEBMENTION_PINGBACK} />
	{/if}
	<link rel="icon" type="image/x-icon" href="/favicon.ico" />
</svelte:head>
