<script>
	import { page } from '$app/stores';
	import Button from '@components/Button.svelte';

	const is404 = $page.status === 404;
</script>

<main>
	<h1>Something went wrong :(</h1>

	<p>
		{is404
			? 'The blog post you tried to visit could not be found. Perhaps it was moved, or a link was rendered incorrectly.'
			: 'There was an unexpected error that could not be handled.'}
	</p>
	<Button href="/blog">Go back to overview</Button>
</main>

<style>
	h1 {
		font-size: 2rem;
	}

	main {
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		align-items: start;
	}
</style>
