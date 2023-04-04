<script>
	export let data;
	const { title, page } = data;
</script>

<div>
	<h1>{title}</h1>
	<main>
		<svelte:component this={page} />
	</main>
</div>

<style>
	.grid {
	}
</style>
