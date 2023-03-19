import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import View from 'ol/View.js';
import { Tile as TileLayer } from 'ol/layer.js';

export const initializeMap = () => {
	const map = new Map({
		layers: [
			new TileLayer({
				source: new OSM()
			})
		],
		controls: [],
		target: 'map',
		view: new View({
			center: [0, 0],
			zoom: 2,
			minZoom: 2
		})
	});

	return map;
};
