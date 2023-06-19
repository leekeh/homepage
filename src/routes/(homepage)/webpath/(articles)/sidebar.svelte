<script>
	import pageMap from './pageMap';
	import { page } from '$app/stores';

	import { Cog, Home } from '@icons';

	$: activePath = $page.url.pathname.slice($page.url.pathname.lastIndexOf('/') + 1);
</script>

<aside>
	<h2>Navigation</h2>
	<nav aria-label="Course navigation">
		<ul>
			<li>
				<a
					href="/webpath"
					class="menu"
					style="border-top: var(--border-width) solid var(--accent);"
				>
					<Home /> Home
				</a>
			</li>
			<li>
				<a
					href="/settings"
					class="menu"
					style="border-bottom: var(--border-width) solid var(--accent)"
				>
					<Cog /> Settings
				</a>
			</li>
			{#each pageMap as { sectionName, pages }, i}
				<li>
					<h3>{sectionName}</h3>
					<ol>
						{#each pages as page}
							<li>
								<a href={page.url} aria-current={page.url === activePath}
									>{page.title} {page.url === activePath ? ' (current)' : ''}</a
								>
							</li>
						{/each}
					</ol>
				</li>
			{/each}
		</ul>
	</nav>
</aside>

<style>
	aside {
		display: none;
		border-right: var(--border-width) solid var(--accent);
		min-width: 20rem;
		overflow: auto;
	}

	h2 {
		font-size: 1.8rem;
		text-align: center;
	}
	h3,
	a,
	h2 {
		padding: 8px;
	}

	a {
		padding-left: 24px;
	}

	.menu {
		padding-left: 16px;
		display: flex;
		gap: 8px;
	}

	a {
		cursor: pointer;
		transition: background-color var(--transition);
		display: block;
		position: relative;
	}

	a:hover {
		background-color: var(--accent-subtle);
	}

	[aria-current]:not([aria-current='false']) {
		background-color: var(--accent-subtle);
	}

	@media (min-width: 1024px) {
		aside {
			display: block;
		}
	}
</style>
