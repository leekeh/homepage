<script lang="ts">
	import { IconButton } from '@components';
	import { isDesktop, isTablet, isLargeScreen } from '@stores';
</script>

<div>
	<aside>sidebar</aside>

	<main>
		main itnrodlc

		<br />
		is Desktop: {$isDesktop}
		<br />
		is Tablet: {$isTablet}
		<br />
		isLargeScreen: {$isLargeScreen}
	</main>

	<IconButton href="/" alt="tem[" style="position: absolute; right: 4px; top: 4px;">test</IconButton
	>
</div>

<style>
	aside {
		border-right: 2px solid var(--accent);
	}
	div {
		position: relative;
		--spacing: 40px;
		outline: 2px solid var(--accent);
		width: calc(100vw - var(--spacing) * 2);
		height: calc(100vh - var(--spacing) * 2);
		margin: var(--spacing);
		background: var(--bg-primary);
		border-radius: 30px;
		display: grid;
		grid-template-columns: 1fr 4fr;

		align-items: stretch;
	}
</style>
