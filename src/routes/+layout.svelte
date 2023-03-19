<script lang="ts">
	import '../reset.css';
	import { Background } from '@img';
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	inject({ mode: dev ? 'development' : 'production' });
</script>

<Background />

<slot />

<style>
	@import url('https://fonts.googleapis.com/css2?family=Source+Serif+Pro:ital,wght@0,200;0,400;0,600;1,200;1,400&display=swap');
	:global(body) {
		background-color: var(--bg-primary);
		font-family: 'Source Serif Pro', serif;
	}

	/* CSS Variables */
	:root {
		--bg-primary: #ececec;
		--accent: #19483a;
		--max-width: 1040px;
		--border-radius: 1rem;
	}
</style>
