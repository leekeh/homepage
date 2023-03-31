<script lang="ts">
	import _500 from './500w.png';
	import _800 from './800w.png';
	import _1200 from './1200w.png';
	import _2000 from './2000w.png';
</script>

<picture>
	<source srcset={_500} media="(max-width: 500px)" />
	<source srcset={_800} media="(max-width: 800px)" />
	<source srcset={_1200} media="(max-width: 1200px)" />
	<source srcset={_2000} media="(min-width: 1200px)" />
	<img alt="" src={_1200} />
</picture>

<style>
	img {
		z-index: -1;
		position: fixed;
		object-fit: cover;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 100%;
	}
</style>
