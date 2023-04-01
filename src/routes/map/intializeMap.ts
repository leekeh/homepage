import Map from 'ol/Map.js';
import Stamen from 'ol/source/Stamen.js';
import View from 'ol/View.js';
import { Tile as TileLayer } from 'ol/layer.js';

export const initializeMap = () => {
	const map = new Map({
		layers: [
			new TileLayer({
				preload: Infinity,
				source: new Stamen({
					layer: 'watercolor',
					cacheSize: 1000
				})
			}),
			new TileLayer({
				preload: Infinity,
				source: new Stamen({
					layer: 'terrain-labels',
					cacheSize: 1000
				})
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
