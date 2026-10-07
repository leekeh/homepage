<script lang="ts">
	import ThumbnailGrid from '@components/ThumbnailGrid.svelte';
	import { treats, thumbSrc } from './data';
</script>

<ThumbnailGrid
	items={treats.map((treat) => ({
		href: `/treats/${treat.imgId}`,
		src: thumbSrc(treat.imgId),
		alt: treat.title
	}))}
/>
