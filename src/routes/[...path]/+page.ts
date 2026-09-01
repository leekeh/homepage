import { widgetNavigationData } from '../../components/widgets/widgets';

export const prerender = true;

export function entries() {
	return widgetNavigationData
		.map((widget) => widget.route)
		.filter((route) => route !== '/' && !route.includes('['))
		.filter((route) => route !== '/blog')
		.map((fullPath) => ({ path: fullPath.replace(/^\//, '') }));
}
