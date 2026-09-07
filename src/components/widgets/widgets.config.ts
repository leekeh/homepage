import type { Component } from 'svelte';

import IconAbout from '@icons/IconAbout.svelte';
import IconBlog from '@icons/IconBlog.svelte';
import IconPaint from '@icons/IconPaint.svelte';
import IconContact from '@icons/IconContact.svelte';
import IconApps from '@icons/IconApps.svelte';
import IconHearts from '@icons/IconHearts.svelte';
import IconTreats from '@icons/IconTreats.svelte';
import IconAquarium from '@icons/IconAquarium.svelte';
import type { PathnameWithSearchOrHash } from '$app/types';

export interface WidgetConfig {
	id: string;
	title: string;
	icon: Component;
	component: () => Promise<{ default: Component }>;
	route: PathnameWithSearchOrHash;
	defaultWidth: number;
	defaultHeight: number;
	defaultMaximized?: boolean;
	defaultX?: number;
	defaultY?: number;
	resizable: boolean;
	minimal: boolean;
	/** When false, excluded from nav lists (Start menu, AppDrawer, desktop icons). Default: true. */
	navigable?: boolean;
	/** Per-page SEO description. Falls back to SITE_DESCRIPTION if omitted. */
	description?: string;
	/** Absolute or root-relative path to the OG image for this page. */
	ogImage?: string;
}

export const widgetConfigs: WidgetConfig[] = [
	{
		id: 'about',
		title: 'About Me',
		icon: IconAbout,
		component: () => import('@widgets/About.svelte'),
		route: '/',
		defaultWidth: 480,
		defaultHeight: 400,
		defaultX: 80,
		defaultY: 60,
		resizable: true,
		minimal: false
	},
	{
		id: 'blog',
		title: 'Blog',
		icon: IconBlog,
		component: () => import('@widgets/Blog.svelte'),
		route: '/blog',
		defaultWidth: 560,
		defaultHeight: 460,
		defaultX: 120,
		defaultY: 40,
		resizable: true,
		minimal: false
	},
	{
		id: 'paint',
		title: 'Paint',
		icon: IconPaint,
		component: () => import('@widgets/paint/Paint.svelte'),
		route: '/paint',
		defaultWidth: 720,
		defaultHeight: 540,
		defaultX: 60,
		defaultY: 30,
		resizable: true,
		minimal: false
	},
	{
		id: 'contact',
		title: 'Contact',
		icon: IconContact,
		component: () => import('@widgets/Contact.svelte'),
		route: '/contact',
		defaultWidth: 380,
		defaultHeight: 300,
		defaultX: 240,
		defaultY: 100,
		resizable: true,
		minimal: false
	},
	{
		id: 'blogpost',
		title: 'Blog Post',
		icon: IconBlog,
		component: () => import('@widgets/blog-post/BlogPost.svelte'),
		route: '/blog/[...slug]',
		defaultWidth: 900,
		defaultHeight: 700,
		defaultX: 30,
		defaultY: 0,
		resizable: true,
		minimal: false
	},
	{
		id: 'apps',
		title: 'Apps',
		icon: IconApps,
		component: () => import('../OS/mobile/AppDrawer.svelte'),
		route: '/apps',
		defaultWidth: 320,
		defaultHeight: 480,
		resizable: false,
		minimal: false,
		navigable: false
	},
	{
		id: 'hire-me',
		title: 'Bugble | Leekeh',
		icon: IconHearts,
		component: () => import('@widgets/hire-me/HireMe.svelte'),
		route: '/hire-me',
		defaultWidth: 336,
		defaultHeight: 544,
		resizable: false,
		minimal: false
	},
	{
		id: 'treats',
		title: 'Sweet Treats',
		icon: IconTreats,
		component: () => import('@widgets/treats/Treats.svelte'),
		route: '/treats',
		defaultWidth: 400,
		defaultHeight: 360,
		defaultX: 100,
		defaultY: 50,
		resizable: true,
		minimal: false,
		description: 'A visual diary of sweet treats, scanned in 3D.'
	},
	{
		id: 'treatdetail',
		title: 'Sweet Treat',
		icon: IconTreats,
		component: () => import('@widgets/treats/TreatDetail.svelte'),
		route: '/treats/[id]',
		defaultWidth: 600,
		defaultHeight: 360,
		defaultX: 120,
		defaultY: 40,
		resizable: true,
		minimal: false,
		description: 'A sweet treat, scanned in 3D.'
	},
	{
		id: 'aquarium',
		title: 'Aquarium',
		icon: IconAquarium,
		component: () => import('@widgets/aquarium/Aquarium.svelte'),
		route: '/aquarium',
		defaultWidth: 480,
		defaultHeight: 320,
		defaultX: 140,
		defaultY: 80,
		resizable: false,
		minimal: true,
		description: 'A retro screensaver aquarium of drifting fish.'
	}
];
