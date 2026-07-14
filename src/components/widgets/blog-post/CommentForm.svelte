<script lang="ts">
	import Button from '@components/OS/Button.svelte';
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import type { ActionResult } from '@sveltejs/kit';

	type Props = {
		slug: string;
	};

	let { slug = 'hello-world' }: Props = $props();

	let name = $state('');
	let content = $state('');
	let submitting = $state(false);
	let submitError = $state<string | null>(null);
	let submitSuccess = $state(false);

	function handleEnhance() {
		submitting = true;
		submitError = null;
		submitSuccess = false;

		return async ({ result }: { result: ActionResult }) => {
			submitting = false;
			if (result.type === 'success') {
				submitSuccess = true;
				name = '';
				content = '';
			} else if (result.type === 'failure') {
				submitError = (result.data as { error?: string })?.error ?? 'Could not submit comment';
			} else {
				submitError = 'Could not submit comment';
			}
		};
	}
</script>

<form class="comment-form" method="POST" action="/blog/{slug}?/comment" use:enhance={handleEnhance}>
	<h4>Leave a comment</h4>

	<label for="comment-name">Name</label>
	<div class="squiggle-border">
		<input
			id="comment-name"
			name="name"
			type="text"
			bind:value={name}
			maxlength="100"
			required
			disabled={submitting}
		/>
	</div>

	<label for="comment-content">Your thoughts</label>
	<div class="squiggle-border">
		<textarea
			id="comment-content"
			name="content"
			bind:value={content}
			placeholder="What are your thoughts on this post?"
			rows="6"
			required
			disabled={submitting}></textarea>
	</div>

	{#if submitError}
		<p class="comments-error">{submitError}</p>
	{:else if (page.form as { error?: string } | null)?.error}
		<p class="comments-error">{(page.form as { error?: string }).error}</p>
	{/if}
	{#if submitSuccess || (page.form as { success?: boolean } | null)?.success}
		<p class="comments-success">Thanks! Your comment is pending approval.</p>
	{/if}

	<Button
		type="submit"
		disabled={submitting}
		style="align-self: flex-start; margin-top: var(--space-3);"
	>
		{submitting ? 'Submitting…' : 'Submit'}
	</Button>
</form>

<style>
	.comment-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.comment-form input,
	.comment-form textarea {
		border: none;
		background-color: transparent;
		padding: var(--space-3);
		width: 100%;
		flex-grow: 1;
		font: inherit;
		resize: vertical;
	}

	.comment-form input {
		border: 1px solid var(--color-border);
	}

	@media print {
		.comment-form {
			display: none;
		}
	}
</style>
