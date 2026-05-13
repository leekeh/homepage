<script lang="ts">
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';

	const posts = $derived($page.data.blogPosts ?? []);
	const categories = $derived($page.data.blogCategories ?? []);
</script>

<div class="blog">
	<h1>Blog</h1>
	<div class="feeds">
		<a href={resolve('/rss.xml')}>RSS: all posts</a>
		{#each categories as category (category)}
			<a href={resolve(`/rss/${category}.xml`)}>RSS: {category}</a>
		{/each}
	</div>
	<div class="post-list">
		{#each posts as post (post.slug)}
			<a class="post-item" href={resolve(`/blog/${post.slug}`)}>
				<span class="post-date">{post.date}</span>
				<span class="post-title">{post.title}</span>
				<span class="post-excerpt">{post.excerpt}</span>
				<span class="post-meta">{post.readingTimeText}</span>
			</a>
		{/each}
	</div>
</div>

<style>
	.blog {
		padding: var(--space-6);
		font-family: var(--font-mono);
		height: 100%;
		overflow-y: auto;
	}

	h1 {
		font-size: var(--font-size-lg);
		color: var(--color-primary);
		margin-bottom: var(--space-6);
		font-family: var(--font-serif);
	}

	.post-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.feeds {
		display: flex;
		gap: var(--space-3);
		flex-wrap: wrap;
		margin-bottom: var(--space-5);
	}

	.feeds a {
		font-size: var(--font-size-xs);
		color: var(--color-link);
		text-decoration: none;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: var(--space-2) var(--space-3);
		background: var(--color-surface-alt);
	}

	.feeds a:hover {
		border-color: var(--color-primary);
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
	}

	.post-item:hover {
		background: var(--color-surface-alt);
		border-color: var(--color-border);
	}

	.post-date {
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
		grid-row: 1;
		padding-top: 2px;
	}

	.post-title {
		font-size: var(--font-size-md);
		color: var(--color-primary);
		font-weight: 600;
		grid-column: 2;
		grid-row: 1;
	}

	.post-excerpt {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		grid-column: 2;
		grid-row: 2;
		line-height: 1.4;
	}

	.post-meta {
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
		grid-column: 2;
		grid-row: 3;
	}
</style>
