<script lang="ts">
	import '../reset.css';
	import { bg } from '@img';
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	inject({ mode: dev ? 'development' : 'production' });
</script>

<img src={bg} alt="" />

<slot />

<style>
	@import url('https://fonts.googleapis.com/css2?family=Source+Serif+Pro:ital,wght@0,200;0,400;0,600;1,200;1,400&display=swap');
	:global(body) {
		background-color: var(--bg-primary);
		background-image: url('bg.jpg');
		background-size: 100vw 100vh;
		font-family: 'Source Serif Pro', serif;
	}
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

	/* CSS Variables */
	:root {
		--bg-primary: #ececec;
		--accent: #19483a;
		--max-width: 1040px;
		--border-radius: 1rem;
	}
</style>
