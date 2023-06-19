<script lang="ts">
	import { GitHubLogo, LinkedInLogo, InstagramLogo } from '@icons';
	import { portrait } from '@img';
	import IconButton from './IconButton.svelte';
</script>

<header>
	<img src={portrait} alt="cartoon drawing of leekeh" />
	<span>
		<h1>leekeh</h1>
		<h2>web dev, foodie & traveller who cares about sustainability & accessibility</h2>
	</span>
	<nav>
		<IconButton href="https://github.com/leekeh" alt="GitHub">
			<GitHubLogo />
		</IconButton>

		<IconButton href="https://www.linkedin.com/in/leekeh/" alt="LinkedIn">
			<LinkedInLogo />
		</IconButton>

		<IconButton href="https://www.instagram.com/leek.eh/" alt="Instagram">
			<InstagramLogo />
		</IconButton>
	</nav>
</header>

<style>
	header {
		background-color: var(--bg-primary);
		border: var(--border-width) solid var(--accent);
		margin: min(5%, 20px);
		padding: 1rem;
		border-radius: var(--border-radius);
		display: flex;
		flex-direction: column;
		gap: max(1rem, 5%);
		align-items: center;
		color: var(--accent);
		max-width: var(--max-width);
		text-align: center;
	}

	@media (min-width: 480px) {
		header {
			flex-direction: row;
			text-align: start;
		}
	}

	img {
		width: 100%;
		min-width: 80px;
		max-width: 130px;
		border-radius: 100%;
		border: var(--border-width) solid var(--accent);
		flex-grow: 0;
		flex-shrink: 1;
	}

	span {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}

	h1 {
		font-size: 2rem;
		font-weight: 600;
	}
	h2 {
		font-size: 1.3rem;
	}

	@media (min-width: 768px) {
		h1 {
			font-size: 3rem;
		}
		h2 {
			font-size: 1.7rem;
		}
	}

	@media (min-width: 1024px) {
		h1 {
			font-size: 4rem;
		}
		h2 {
			font-size: 2rem;
		}
	}

	nav {
		display: flex;
		gap: 0.5rem;
	}

	@media (min-width: 480px) {
		nav {
			flex-direction: column;
		}
	}
</style>
