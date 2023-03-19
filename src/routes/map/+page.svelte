<script lang="ts">
	import IconButton from '@components/IconButton.svelte';
	import type Map from 'ol/Map.js';
	import { PlusIcon, MinusIcon } from '@icons';

	import { onMount } from 'svelte';
	import { initializeMap } from './intializeMap';

	let map: Map;

	onMount(() => {
		map = initializeMap();
	});

	const handleZoom = (isIncrease: boolean) => {
		const view = map.getView();
		const zoom = view.getZoom();
		const mutation = 0.5 * (isIncrease ? 1 : -1);
		view.animate({ zoom: Math.max(zoom ? zoom + mutation : mutation, 2), duration: 300 });
	};
</script>

<svelte:head>
	<link rel="stylesheet" href="node_modules/ol/ol.css" />
</svelte:head>

<div id="map" class="map" draggable="false" />

<menu>
	<IconButton variant="strong" onClick={() => handleZoom(true)} alt="Zoom in">
		<PlusIcon />
	</IconButton>
	<IconButton variant="strong" onClick={() => handleZoom(false)} alt="Zoom out">
		<MinusIcon />
	</IconButton>
</menu>

<style>
	menu {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		position: absolute;
		top: 1rem;
		left: 1rem;
	}
	.map {
		width: 100vw;
		height: 100vh;
	}
</style>
