import Circle from 'ol/geom/Circle.js';
import Feature from 'ol/Feature.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import { Vector as VectorSource } from 'ol/source.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import bezier from '@turf/bezier-spline';

const multiPolygonGeometry = bezier(
	{
		type: 'LineString',
		coordinates: [
			[-76.091308, 18.427501],
			[-76.695556, 18.729501],
			[-76.552734, 19.40443],
			[-74.61914, 19.134789],
			[-73.652343, 20.07657],
			[-73.157958, 20.210656]
		]
	},
	{ properties: { stroke: '#FFF', 'stroke-width': '2%' } }
);

const multiPolygonFeature = new GeoJSON().readFeature(multiPolygonGeometry);
multiPolygonFeature.setId('multiPolygonFeature1');

export const routeLayer = new VectorLayer({
	source: new VectorSource({
		features: [multiPolygonFeature, new Feature(new Circle([-74.6301269, 19.165924253], 1000))]
	})
});
