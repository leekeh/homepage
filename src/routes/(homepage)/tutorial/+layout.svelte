<div>
	<slot />
</div>

<style>
	div {
		--spacing: 0.625rem;
		position: relative;
		outline: var(--border-width) solid var(--accent);
		width: calc(100vw - var(--spacing) * 2);
		height: calc(100vh - var(--spacing) * 2);
		margin: calc(var(--spacing) + env(safe-area-inset-left))
			calc(var(--spacing) + env(safe-area-inset-right))
			calc(var(--spacing) + env(safe-area-inset-bottom))
			calc(var(--spacing) + env(safe-area-inset-left));
		background: var(--bg-primary);
		border-radius: var(--border-radius);
	}

	@media (min-width: 768px) {
		div {
			--spacing: 1.25rem;
		}
	}

	@media (min-width: 1024px) {
		div {
			--spacing: 2.5rem;
		}
	}
</style>
