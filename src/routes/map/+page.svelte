<script lang="ts">
	import IconButton from '@components/IconButton.svelte';
	import type Map from 'ol/Map.js';
	import { PlusIcon, MinusIcon, InfoIcon } from '@icons';

	import { onMount } from 'svelte';
	import { initializeMap } from './intializeMap';
	import { Dialog } from '@components';

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

	let showModal = false;
</script>

<div id="map" class="map" draggable="false" />

<menu>
	<IconButton variant="strong" onClick={() => handleZoom(true)} alt="Zoom in">
		<PlusIcon />
	</IconButton>
	<IconButton variant="strong" onClick={() => handleZoom(false)} alt="Zoom out">
		<MinusIcon />
	</IconButton>
	<IconButton variant="strong" onClick={() => (showModal = true)} alt="About">
		<InfoIcon />
	</IconButton>
</menu>

<Dialog bind:showModal>
	<h2>About</h2>
	<br />
	<p>
		Map tiles by <a href="http://stamen.com">Stamen Design</a>, under
		<a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by
		<a href="http://openstreetmap.org">OpenStreetMap</a>, under
		<a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.
	</p>
</Dialog>

<style>
	menu {
		display: grid;
		gap: 1rem;
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		padding: 1rem;
		grid-template-rows: auto auto 1fr;
		align-items: end;
	}

	.map {
		width: 100vw;
		height: 100vh;
		background-color: #78e4e5;
	}

	h2 {
		font-size: 2rem;
		font-weight: 600;
	}
</style>
