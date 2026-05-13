import type { Component } from 'svelte';

import IconAbout from '@icons/IconAbout.svelte';
import IconBlog from '@icons/IconBlog.svelte';
import IconPaint from '@icons/IconPaint.svelte';
import IconContact from '@icons/IconContact.svelte';
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
	hasMenuBar: boolean;
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
		minimal: false,
		hasMenuBar: false
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
		minimal: false,
		hasMenuBar: true
	},
	{
		id: 'paint',
		title: 'Paint',
		icon: IconPaint,
		component: () => import('@widgets/Paint.svelte'),
		route: '/paint',
		defaultWidth: 720,
		defaultHeight: 540,
		defaultX: 60,
		defaultY: 30,
		resizable: true,
		minimal: false,
		hasMenuBar: true
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
		minimal: false,
		hasMenuBar: false
	},
	{
		id: 'blogpost',
		title: 'Blog Post',
		icon: IconBlog,
		component: () => import('@widgets/BlogPost.svelte'),
		route: '/blog/[slug]',
		defaultWidth: 560,
		defaultHeight: 480,
		defaultMaximized: true,
		defaultX: 140,
		defaultY: 50,
		resizable: true,
		minimal: false,
		hasMenuBar: false
	}
];
