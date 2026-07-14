<script>
	// Logos are pulled from simpleicons.org's CDN at runtime (https://cdn.simpleicons.org/{slug}).
	// Slugs are Simple Icons' own naming, not always the obvious one, e.g. Vue = "vuedotjs".
	// Double check any that look wrong at https://simpleicons.org — the onerror fallback
	// will just show the framework name as text if a slug is wrong or an icon is missing.

	const columns = [
		{ key: 'jsx', label: 'JSX syntax' },
		{ key: 'template', label: 'Template syntax' },
		{ key: 'webcomponents', label: 'Web components' }
	];

	const rows = [
		{ key: 'signals', label: 'Signals (fine-grained)' },
		{ key: 'rerender', label: 'Component re-render' }
	];

	const frameworks = [
		{ name: 'Solid', slug: 'solid', col: 'jsx', row: 'signals' },
		{ name: 'Qwik', slug: 'qwik', col: 'jsx', row: 'signals' },

		{ name: 'React', slug: 'react', col: 'jsx', row: 'rerender' },
		{ name: 'Preact', slug: 'preact', col: 'jsx', row: 'rerender' },

		{ name: 'Svelte', slug: 'svelte', col: 'template', row: 'signals' },
		{ name: 'Vue', slug: 'vuedotjs', col: 'template', row: 'signals' },

		{ name: 'Angular', slug: 'angular', col: 'template', row: 'rerender' },
		{ name: 'Ember', slug: 'emberdotjs', col: 'template', row: 'rerender' },

		{ name: 'Lit', slug: 'lit', col: 'webcomponents', row: 'rerender' },
		{ name: 'Stencil', slug: 'stencil', col: 'webcomponents', row: 'rerender' }
	];

	const noReactivity = [
		{ name: 'jQuery', slug: 'jquery', note: 'Imperative DOM manipulation, no state model at all' },
		{
			name: 'htmx',
			slug: 'htmx',
			note: 'State lives server-side; client just swaps HTML fragments'
		}
	];

	const metaFrameworks = [
		{ name: 'Next.js', slug: 'nextdotjs', builds: 'React' },
		{ name: 'Nuxt', slug: 'nuxtdotjs', builds: 'Vue' },
		{ name: 'SvelteKit', slug: 'svelte', builds: 'Svelte' },
		{ name: 'Remix', slug: 'remix', builds: 'React' },
		{ name: 'Astro', slug: 'astro', builds: 'framework-agnostic islands' }
	];

	function cellFrameworks(col, row) {
		return frameworks.filter((f) => f.col === col && f.row === row);
	}

	function handleLogoError(e) {
		e.target.style.display = 'none';
	}
</script>

<div class="wrap squiggle-border">
	<div class="grid">
		<div class="corner"></div>
		{#each columns as col (col.key)}
			<div class="col-label">{col.label}</div>
		{/each}

		{#each rows as row (row.key)}
			<div class="row-label">{row.label}</div>
			{#each columns as col (col.key)}
				<div class="cell" class:empty={cellFrameworks(col.key, row.key).length === 0}>
					{#each cellFrameworks(col.key, row.key) as fw (fw.slug)}
						<div class="chip">
							<img src="https://cdn.simpleicons.org/{fw.slug}" alt="" on:error={handleLogoError} />
							<span>{fw.name}</span>
						</div>
					{:else}
						<span class="dash">—</span>
					{/each}
				</div>
			{/each}
		{/each}
	</div>

	<div class="panel">
		<h3>No client-side reactivity model</h3>
		<div class="panel-row">
			{#each noReactivity as lib (lib.slug)}
				<div class="chip wide">
					<img src="https://cdn.simpleicons.org/{lib.slug}" alt="" on:error={handleLogoError} />
					<div>
						<span class="name">{lib.name}</span>
						<span class="note">{lib.note}</span>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<div class="panel muted">
		<h3>Meta-frameworks (different axis: routing / SSR / SSG, not reactivity)</h3>
		<div class="panel-row">
			{#each metaFrameworks as mf (mf.slug)}
				<div class="chip">
					<img src="https://cdn.simpleicons.org/{mf.slug}" alt="" on:error={handleLogoError} />
					<span>{mf.name} <em>({mf.builds})</em></span>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.wrap {
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
		color: #1a1a1a;
		margin: 0 auto;
		padding: var(--space-6);
		margin-block: var(--space-6);
	}

	.grid {
		display: grid;
		grid-template-columns: 140px repeat(3, 1fr);
		gap: 10px;
		margin-bottom: 28px;
	}

	.corner {
		background: transparent;
	}

	.col-label,
	.row-label {
		display: flex;
		align-items: center;
		font-weight: 600;
		font-size: 13px;
		color: #555;
	}

	.col-label {
		justify-content: center;
		padding: 6px 4px;
	}

	.row-label {
		padding-right: 8px;
	}

	.cell {
		/* background: #f6f5f1; */
		/* border: 1px solid #e2e0d8; */
		border-radius: 10px;
		padding: 12px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-height: 80px;
		justify-content: center;
	}

	.cell.empty {
		align-items: center;
		justify-content: center;
	}

	.dash {
		color: #999;
		font-size: 13px;
	}

	.chip {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
	}

	.chip img {
		width: 18px;
		height: 18px;
		flex-shrink: 0;
	}

	.chip.wide {
		align-items: flex-start;
		gap: 12px;
	}

	.chip.wide img {
		width: 24px;
		height: 24px;
		margin-top: 2px;
	}

	.chip.wide div {
		display: flex;
		flex-direction: column;
	}

	.chip .name {
		font-weight: 600;
	}

	.chip .note {
		font-size: 12px;
		color: #666;
	}

	.panel {
		/* border: 1px solid #e2e0d8; */
		border-radius: 10px;
		padding: 16px 18px;
		margin-bottom: 16px;
	}

	.panel.muted {
		/* background: #fafaf8; */
	}

	.panel h3 {
		font-size: 13px;
		font-weight: 600;
		margin: 0 0 12px;
		color: #444;
		display: none;
	}

	.panel-row {
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
	}

	.panel-row em {
		color: #888;
		font-style: normal;
		font-size: 12px;
	}
</style>
