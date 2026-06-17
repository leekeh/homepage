<script lang="ts">
	import { onMount } from 'svelte';

	const startupDuration = 1500;
	const animationTimeout = 300;

	// animate the amount of dots
	let dots = 1;
	const maxDots = 3;
	const dotInterval = 500;
	let isAnimating = true;

	function finishAnimation() {
		document.documentElement.classList.remove('js-hydrating');
		isAnimating = false;
	}

	onMount(() => {
		setInterval(() => {
			dots = (dots + 1) % (maxDots + 1);
		}, dotInterval);

		setTimeout(() => {
			requestAnimationFrame(() => {
				finishAnimation();
			});
		}, startupDuration);
	});
</script>

<!-- @component
Startup animation overlay that automatically unrenders after set time.
 -->

<!-- toggle animation as soon as the document is ready, before it renders -->
<svelte:head>
	<script async fetchpriority="high" defer blocking="render">
		document.documentElement.classList.add('js-hydrating');
	</script>
</svelte:head>

{#if isAnimating}
	<div class="hydration-overlay" aria-hidden="true">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="48"
			height="48"
			fill="none"
			stroke="currentColor"
			stroke-width="1"
			stroke-linecap="round"
			stroke-linejoin="round"
			viewBox="0 0 24 24"
		>
			<path d="M 3.068 13.293 C 6.089 18.096 19.194 17.552 20.411 13.303"></path>
			<ellipse stroke-width="0" fill="currentColor" cx="16" cy="9" rx="1" ry="1"></ellipse>
			<ellipse stroke-width="0" fill="currentColor" cx="8" cy="9" rx="1" ry="1"></ellipse>
		</svg>
		<p>Starting up computer{'.'.repeat(dots)}</p>
		<div
			class="progress-bar"
			style="--animation-duration: {startupDuration -
				animationTimeout * 2}ms; --animation-delay: {animationTimeout}ms"
			aria-hidden="true"
		></div>
	</div>
{/if}

<style>
	.hydration-overlay {
		display: none;
	}

	:global(html.js-hydrating) .hydration-overlay {
		position: fixed;
		z-index: calc(var(--z-overlay) + 100);
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--space-6);
		font-size: var(--font-size-xl);
		background-color: var(--color-bg-primary);
		color: var(--color-fg-primary);
	}

	.progress-bar {
		width: 80%;
		height: 1.5rem;
		margin-top: 20px;
		position: relative;
		border-radius: var(--radius-lg);
		border: var(--border-width) solid currentColor;
		filter: var(--filter-squiggle);

		&::before {
			--inset: var(--space-2);
			inset: var(--inset);
			right: 100%;
			background: var(--color-accent);
			content: '';
			position: absolute;
			border-radius: calc(var(--radius-lg) - var(--inset));
			animation: load var(--animation-duration) cubic-bezier(0.5, 0, 0.5, 1) var(--animation-delay)
				forwards;
		}
	}

	p {
		font-family: sans-serif;
		font-size: var(--font-size-xl);
	}

	@media (prefers-reduced-motion: reduce) {
		.progress-bar::before {
			animation: none;
		}
	}

	@keyframes load {
		from {
			right: 100%;
		}
		to {
			right: var(--inset);
		}
	}
</style>
