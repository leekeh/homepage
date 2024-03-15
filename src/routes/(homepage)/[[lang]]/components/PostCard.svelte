<script lang="ts">
	import type { Post } from '../types';
	export let post: Post;
	import Image from '@components/Image.svelte';
</script>

<Image src={post.imageSrc} alt={post.title} width="100%" height="auto" aspectRatio="1200 / 630" />
{post.title}
