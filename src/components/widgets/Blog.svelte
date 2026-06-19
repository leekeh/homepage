<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import type { BlogPost } from '../../content/blog';
	import { IconRSS } from '@icons/index';

	const posts = $derived((page.data.blogPosts ?? []) as BlogPost[]);
	const categories = $derived((page.data.blogCategories ?? []) as string[]);
</script>

{#snippet feedLink(category?: string)}
	<li>
		<a
			class="feed-link"
			href={resolve(category ? `/rss/${category}.xml` : '/rss.xml')}
			aria-label={category ? `RSS feed for ${category}` : 'Global RSS feed'}
			data-sveltekit-reload>{category ?? 'All posts'}</a
		>
	</li>
{/snippet}

<div class="blog">
	<ul class="post-list">
		{#each posts as post (post.slug)}
			{const titleId = `post-title-${post.slug}`}
			{const excerptId = `post-excerpt-${post.slug}`}
			<li>
				<a
					class="post-item squiggle-border"
					href={resolve(`/blog/${post.slug}`)}
					aria-labelledby={titleId}
					aria-describedby={excerptId}
				>
					<span class="post-date">{post.date}</span>
					<span class="post-title" id={titleId}>{post.title}</span>
					<span class="post-excerpt" id={excerptId}>{post.excerpt}</span>
					<span class="post-meta">{post.readingTimeText}</span>
				</a>
			</li>
		{/each}
	</ul>
	<div class="feeds">
		{const labelId = 'rss-feeds-label'}
		<h2 id={labelId}><IconRSS /> <span class="visually-hidden">RSS Feeds</span></h2>
		<ul aria-labelledby={labelId}>
			{@render feedLink()}
			{#each categories as category (category)}
				{@render feedLink(category)}
			{/each}
		</ul>
	</div>
</div>

<style>
	.blog {
		padding: var(--space-6);
		font-family: var(--font-mono);
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.post-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		padding: var(--space-1);
		overflow-y: auto;
	}

	.feeds {
		display: flex;
		margin-top: auto;
		gap: var(--space-3);
		h2 {
			font-size: var(--font-size-sm);
			font-family: var(--font-sans);
			font-weight: 500;
			:global(svg) {
				width: 1.2em;
				height: 1.2em;
				filter: var(--filter-squiggle);
				display: inline-block;
				vertical-align: middle;
			}
		}
		ul {
			display: flex;
			gap: var(--space-3);
			flex-wrap: wrap;
			margin-bottom: var(--space-5);
		}
	}

	.post-item {
		display: grid;
		grid-template-columns: 90px 1fr;
		grid-template-rows: auto auto;
		gap: var(--space-1) var(--space-4);
		padding: var(--space-4) var(--space-3);
		border: 1px solid transparent;
		border-radius: var(--radius-md);
		text-decoration: none;
		color: var(--color-text);

		&:hover {
			background-color: var(--color-bg-preview);
			border-color: var(--color-border);
		}

		&:active {
			background-color: var(--color-bg-highlight);
		}
	}

	.post-date {
		font-size: var(--font-size-xs);
		grid-row: 1;
		padding-top: 2px;
	}

	.post-title {
		font-size: var(--font-size-md);
		background-color: var(--color-bg-highlight);
		width: fit-content;
		font-weight: 600;
		grid-column: 2;
		grid-row: 1;
	}

	.post-excerpt {
		font-size: var(--font-size-sm);
		grid-column: 2;
		grid-row: 2;
		line-height: 1.4;
	}

	.post-meta {
		font-size: var(--font-size-xs);
		grid-column: 2;
		grid-row: 3;
	}

	.feed-link {
		font-size: var(--font-size-xs);
		background-color: var(--color-bg-highlight);
		padding: var(--space-1) var(--space-2);
	}
</style>
