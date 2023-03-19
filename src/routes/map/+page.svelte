<script lang="ts">
	import Map from 'ol/Map.js';
	import OSM from 'ol/source/OSM.js';
	import TileLayer from 'ol/layer/Tile.js';
	import View from 'ol/View.js';
	import { onMount } from 'svelte';

	let map: Map;

	onMount(async () => {
		map = new Map({
			layers: [
				new TileLayer({
					source: new OSM()
				})
			],
			target: 'map',
			view: new View({
				center: [0, 0],
				zoom: 2
			})
		});
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="node_modules/ol/ol.css" />
</svelte:head>

<div id="map" class="map" draggable="false" />

<style>
	.map {
		width: 100vw;
		height: 100vh;
	}
</style>
