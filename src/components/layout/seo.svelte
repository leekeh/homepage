<script lang="ts">
	import type { LayoutData } from '../../routes/$types';

	import { page } from '$app/state';
	import { getWidgetByRoute } from '../../components/widgets/widgets';
	import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME } from '../../content/site';
	import { WEBMENTION_ENDPOINT, WEBMENTION_PINGBACK } from '../../content/webmentions';

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
				type: 'article' as const,
				url: currentPost.canonicalUrl,
				image: currentPost.ogImage ? absoluteUrl(currentPost.ogImage) : undefined,
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
			url: absoluteUrl(currentPath),
			image: widget?.ogImage ? absoluteUrl(widget.ogImage) : undefined,
			imageAlt: widget?.title as string | undefined,
			article: undefined
		};
	});
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<link rel="canonical" href={seo.url} />
	<meta property="og:site_name" content={SITE_NAME} />
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
	{#if WEBMENTION_ENDPOINT}
		<link rel="webmention" href={WEBMENTION_ENDPOINT} />
	{/if}
	{#if WEBMENTION_PINGBACK}
		<link rel="pingback" href={WEBMENTION_PINGBACK} />
	{/if}
	<link rel="icon" type="image/x-icon" href="/favicon.ico" />
</svelte:head>
