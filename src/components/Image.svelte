<script lang="ts">
	export let src: string;
	export let alt: string;
	export let height: number | string;
	export let width: number | string;
	export let aspectRatio: number | string;
	export let style: string = '';
	export let description: string = '';
	import fail from './fail.svg';

	let imgSrc = src;
	let loading = true;
	let failed = false;

	const handleError = () => {
		loading = false;
		failed = true;
		imgSrc = fail;
	};
</script>

<figure style={`width: ${width}; ${style}`}>
	<img
		alt={failed ? 'Image not found' : alt}
		{height}
		on:load={() => (loading = false)}
		on:error={handleError}
		width="100%"
		style={`aspect-ratio: ${aspectRatio}`}
		class:isLoading={loading}
		class:failed
		aria-busy={loading}
		src={imgSrc}
		loading="lazy"
	/>
	{#if description}
		<figcaption>{description}</figcaption>
	{/if}
</figure>

<style>
	img {
		background-color: var(--accent-subtle);
	}

	.failed {
		object-fit: scale-down;
	}

	figcaption {
		text-align: center;
		padding: 1rem;
	}

	figure {
		display: grid;
		grid-template-columns: 1fr;
		outline: var(--border-width) solid var(--accent);
		border-radius: var(--border-radius);
		overflow: hidden;
	}

	@keyframes gradientAnimation {
		0% {
			background-position: 100% 100%;
		}
		50% {
			background-position: 0% 0%;
		}
		100% {
			background-position: 100% 100%;
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		.isLoading {
			background-image: linear-gradient(to bottom right, var(--accent-subtle), var(--accent));
			background-size: 200% 200%;
			animation: gradientAnimation 1.5s ease infinite;
		}
	}
</style>
