<div>
	<slot />
</div>

<style>
	div {
		--spacing: 10px;
		position: relative;
		outline: 2px solid var(--accent);
		width: calc(100vw - var(--spacing) * 2);
		height: calc(100vh - var(--spacing) * 2);
		margin: calc(var(--spacing) + env(safe-area-inset-left))
			calc(var(--spacing) + env(safe-area-inset-right))
			calc(var(--spacing) + env(safe-area-inset-bottom))
			calc(var(--spacing) + env(safe-area-inset-left));
		background: var(--bg-primary);
		border-radius: 30px;
	}

	@media (min-width: 768px) {
		div {
			--spacing: 20px;
		}
	}

	@media (min-width: 1024px) {
		div {
			--spacing: 40px;
		}
	}
</style>
