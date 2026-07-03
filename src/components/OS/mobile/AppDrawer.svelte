<script lang="ts">
	import { widgetNavigationData } from '../../widgets/widgets';
	import { resolve } from '$app/paths';
	import AppIcon from '../shared/AppIcon.svelte';
</script>

<nav class="apps-view" aria-label="All applications">
	<ul class="app-grid">
		{#each widgetNavigationData as widget (widget.id)}
			<li>
				<a class="app-grid-item" href={resolve(widget.route)}>
					<AppIcon icon={widget.icon} label={widget.title} />
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style>
	.apps-view {
		padding: var(--space-6) var(--space-4) var(--space-8);
		height: 100%;
		overflow-y: auto;
		box-sizing: border-box;
	}

	.app-grid {
		display: grid;
		list-style: none;
		padding: 0;
		margin: 0;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: var(--space-6) var(--space-3);
	}

	.app-grid-item {
		text-decoration: none;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
		min-width: 0;
	}

	.app-grid-item:hover,
	.app-grid-item:active {
		opacity: 0.92;
	}

	@media (max-width: 420px) {
		.app-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
