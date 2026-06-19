<script lang="ts">
	import { page } from '$app/state';
	import type { BlogPost } from '../../content/blog';

	import { resolve } from '$app/paths';
	import { useWindowManager } from '../OS/shared/windowManager.svelte';

	const wm = $derived(useWindowManager());
	const windowId = $derived(wm.activeWindow?.id);

	type Props = {
		slug?: string;
	};

	let { slug = 'hello-world' }: Props = $props();

	const posts = $derived((page.data.blogPosts ?? []) as BlogPost[]);
	const fallbackPost = $derived(posts[0]);
	const post = $derived(posts.find((entry: BlogPost) => entry.slug === slug) ?? fallbackPost);

	function closeSelf() {
		if (windowId) {
			wm.close(windowId);
		}
	}
</script>

<article class="blog-post h-entry">
	<header>
		<!-- gtodo this link should clouse the current page -->
		<a class="back-link" href={resolve('/blog')} onclick={closeSelf}>&larr; Back to blog</a>
		<h2 class="p-name">{post.title}</h2>
		<a class="u-url" href={resolve(post.canonicalUrl)}>{post.canonicalUrl}</a>
		<time class="date dt-published" datetime={post.date}>{post.date} • {post.readingTimeText}</time>
	</header>
	<div class="body e-content">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html post.html}
	</div>

	<!-- <section class="webmentions">
		<h2>Mentions</h2>
		{#if webmentionsLoading}
			<p class="webmentions-empty">Loading mentions...</p>
		{:else if webmentions.length === 0}
			<p class="webmentions-empty">No mentions yet.</p>
		{:else}
			<ul>
				{#each webmentions as mention (mention.id)}
					<li>
						<a
							href={mention.authorUrl || mention.url || '#'}
							target="_blank"
							rel="noreferrer noopener"
						>
							{mention.authorName}
						</a>
						{#if mention.content}
							<p>{mention.content}</p>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</section> -->
</article>

<style>
	.blog-post {
		padding: var(--space-6);
		font-family: var(--font-mono);
		height: 100%;
		overflow-y: auto;
	}

	header {
		margin-bottom: var(--space-7);
	}

	.back-link {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		text-decoration: none;
		display: inline-block;
		margin-bottom: var(--space-4);
	}

	.back-link:hover {
		color: var(--color-primary);
	}

	h1 {
		font-size: var(--font-size-xl);
		color: var(--color-primary);
		font-family: var(--font-serif);
		margin-bottom: var(--space-3);
	}

	.date {
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
	}

	.u-url {
		display: none;
	}

	.webmentions {
		margin-top: var(--space-7);
		padding-top: var(--space-6);
		border-top: 1px solid var(--color-border);
	}

	.webmentions h2 {
		font-size: var(--font-size-md);
		margin-bottom: var(--space-4);
	}

	.webmentions ul {
		list-style: none;
		display: grid;
		gap: var(--space-4);
		padding: 0;
	}

	.webmentions li {
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: var(--space-4);
		background: var(--color-surface-alt);
	}

	.webmentions li a {
		color: var(--color-primary);
		font-weight: 600;
		text-decoration: none;
	}

	.webmentions li p {
		margin-top: var(--space-3);
		color: var(--color-text-muted);
		line-height: 1.5;
	}

	.webmentions-empty {
		color: var(--color-text-muted);
	}
</style>
