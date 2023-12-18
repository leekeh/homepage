<script lang="ts">
	import Image from '@components/Image.svelte';

	export let data;

	$: ({ posts } = data);
</script>

Blog overview goes here
{#each posts as post}
	{#if post}
		<Image
			src={post.imageSrc}
			alt={post.title}
			width="100%"
			height="auto"
			aspectRatio="1200 / 630"
		/>
		{post.title}
	{/if}
{/each}
