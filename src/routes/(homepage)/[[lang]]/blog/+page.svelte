<script lang="ts">
	import Header from '../components/Header.svelte';
	import PostCard from '../components/PostCard.svelte';
	export let data;

	$: ({ posts } = data);
</script>

<Header />
{#each posts as post}
	{#if post}
		<PostCard {post} />
	{/if}
{/each}
