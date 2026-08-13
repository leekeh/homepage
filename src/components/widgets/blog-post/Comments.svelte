<script lang="ts">
	import { browser } from '$app/environment';
	import { formatDate } from '@utils/date';

	type Comment = {
		ID: string;
		Name: string;
		Content: string;
		Timestamp: string;
	};

	type Props = {
		slug: string;
		initialComments?: Comment[];
	};

	let { slug, initialComments }: Props = $props();

	let fetchedComments = $state<Comment[] | null>(null);
	let fetching = $state(false);
	let commentsError = $state<string | null>(null);

	const comments = $derived(fetchedComments ?? initialComments ?? []);
	const commentsLoading = $derived(
		fetching || (fetchedComments === null && initialComments === undefined)
	);

	async function loadComments() {
		fetching = true;
		commentsError = null;
		try {
			const res = await fetch(`/api/comments/${encodeURIComponent(slug)}`);
			if (!res.ok) throw new Error(`Failed to load comments (${res.status})`);
			fetchedComments = await res.json();
		} catch (e) {
			commentsError = e instanceof Error ? e.message : 'Could not load comments';
		} finally {
			fetching = false;
		}
	}

	// format date in ago
	const now = new Date();

	function formatDateAgo(timestamp: string) {
		const date = new Date(timestamp);
		const diff = now.getTime() - date.getTime();
		const minutes = Math.floor(diff / 1000 / 60);
		if (minutes < 60) {
			if (minutes === 1) return '1 minute ago';
			return `${minutes} minutes ago`;
		}
		// hours
		const hours = Math.floor(minutes / 60);
		if (hours < 24) {
			if (hours === 1) return '1 hour ago';
			return `${hours} hours ago`;
		}
		// days
		const days = Math.floor(hours / 24);
		if (days < 30) {
			if (days === 1) return 'yesterday';
			return `${days} days ago`;
		}
		return formatDate(timestamp);
	}

	$effect(() => {
		if (browser && initialComments === undefined) loadComments();
	});
</script>

{#if commentsLoading}
	<p class="comments-status">Loading comments…</p>
{:else if commentsError}
	<p class="comments-status comments-error">{commentsError}</p>
{:else if comments.length === 0}
	<p class="comments-status">No comments yet — be the first!</p>
{:else}
	<ul class="comment-list">
		{#each comments as comment (comment.ID)}
			<li>
				<strong>{comment.Name}</strong>
				·
				<time datetime={comment.Timestamp}>
					{formatDateAgo(comment.Timestamp)}
				</time>
				<p class="comment-body">{comment.Content}</p>
			</li>
		{/each}
	</ul>
{/if}
