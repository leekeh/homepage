<div>
	<!-- <slot /> -->
	<p style={'padding: 8px'}>This section is under construction. Come back later :) </p>

</div>

<style>
	div {
		--spacing: min(3%, 25px);
		position: relative;
		outline: var(--border-width) solid var(--accent);
		width: calc(100vw - var(--spacing) * 2);
		max-width: 90rem;
		height: 100%;
		margin: calc(var(--spacing) + env(safe-area-inset-left))
			calc(var(--spacing) + env(safe-area-inset-right))
			calc(var(--spacing) + env(safe-area-inset-bottom))
			calc(var(--spacing) + env(safe-area-inset-left));
		background: var(--bg-primary);
		border-radius: var(--border-radius);
		overflow: auto;
		font-size: 1.3rem;
		line-height: 1.2;
	}

	:global(body) {
		height: 100%;
	}
	:global(html) {
		height: 100%;
	}
</style>
