<script lang="ts">
	import type { Component } from 'svelte';
	import { page } from '$app/state';
	import Content from '@components/content.svelte';
	import { formatDate } from '@utils/date';
	import CommentForm from './CommentForm.svelte';
	import Comments from './Comments.svelte';
	import NotFound from './NotFound.svelte';

	type PostMetadata = {
		title?: string;
		publishedAt?: string;
		description?: string;
		categories?: string[];
		tags?: string[];
		lastModified?: string | null;
		changelog?: string[];
		readingTime?: { text: string; minutes: number };
	};

	type Props = { slug?: string };
	let { slug = 'hello-world' }: Props = $props();

	// Use data from the server load function when slug matches (SSR / prerender path).
	// Falls back to dynamic loading when the widget is opened via client-side navigation,
	// which cancels the SvelteKit navigation before the load function can run.
	const serverPost = $derived(
		page.data?.slug === slug
			? (page.data as { PostComponent: Component; metadata: PostMetadata })
			: null
	);

	const initialComments = $derived(
		page.data?.slug === slug ? page.data.initialComments : undefined
	);

	const postModules = import.meta.glob<{ default: Component; metadata: PostMetadata }>(
		'../../../content/blog/posts/**/*.mdx'
	);
	// Map from slug (== post's directory path under posts/, matching getSlugFromPath
	// in content/blog/server.ts) → module loader, so nested posts keep their folders
	// in the URL and resolve correctly.
	const postLoadersBySlug: Record<
		string,
		() => Promise<{ default: Component; metadata: PostMetadata }>
	> = Object.fromEntries(
		Object.entries(postModules).map(([path, loader]) => {
			const afterPosts = path.split('/posts/').at(-1)!;
			const s = afterPosts.split('/').slice(0, -1).join('/');
			return [s, loader];
		})
	);
	const loadPost = (s: string) =>
		postLoadersBySlug[s]?.() ?? Promise.reject(new Error('Post not found'));
</script>

{#snippet renderPost(PostComponent: Component, metadata: PostMetadata)}
	<article>
		<Content removeStartPadding>
			<div class="body e-content">
				<header class="post-header">
					<h2 class="title">{metadata?.title}</h2>
					<div class="post-meta">
						{#if metadata?.publishedAt}
							<span>
								Posted
								<time datetime={metadata.publishedAt}>{formatDate(metadata.publishedAt)}</time>
							</span>
						{/if}

						{#if metadata?.readingTime}
							<span class="post-reading-time">{metadata.readingTime.text}</span>
						{/if}
					</div>
				</header>
				<PostComponent />
			</div>

			<section class="comments">
				<hr />
				<h3>Feedback</h3>
				<Comments {slug} {initialComments} />
				<CommentForm {slug} />
			</section>
		</Content>
	</article>
{/snippet}

{#if serverPost}
	{@render renderPost(serverPost.PostComponent, serverPost.metadata)}
{:else}
	{#await loadPost(slug) then postModule}
		{@render renderPost(postModule.default, postModule.metadata)}
	{:catch}
		<NotFound />
	{/await}
{/if}

<style>
	.post-header {
		padding-left: var(--space-1);
		padding-bottom: var(--space-5);
	}

	.post-meta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
		font-family: var(--font-mono);
		font-weight: 500;
		margin-bottom: var(--space-3);
		font-style: italic;
		color: var(--color-fg-muted);

		/* Separate items with a dot */
		> * + *::before {
			content: '·';
			margin-right: var(--space-3);
		}
	}

	/* Comments */
	.comments {
		margin-top: var(--space-7);
		padding-top: var(--space-6);
		display: flex;
		flex-direction: column;
		gap: var(--space-5);

		hr {
			filter: var(--filter-squiggle);
			color: inherit;
			margin: 0 !important;
			border-style: dashed;
			border-width: var(--border-width);
			border-bottom: none;
		}
	}

	.title {
		margin-top: var(--space-5);
	}

	/* On desktop, the window is used to contain the title */
	@media (min-width: 769px) {
		.title {
			display: none;
		}
	}
</style>
