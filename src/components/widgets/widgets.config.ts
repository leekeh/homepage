import type { Component } from 'svelte';

import IconAbout from '@icons/IconAbout.svelte';
import IconBlog from '@icons/IconBlog.svelte';
import IconPaint from '@icons/IconPaint.svelte';
import IconContact from '@icons/IconContact.svelte';
import IconApps from '@icons/IconApps.svelte';
import IconHearts from '@icons/IconHearts.svelte';
import IconTreats from '@icons/IconTreats.svelte';
import IconFolders from '@icons/IconFolders.svelte';
import IconAccessibility from '@icons/IconAccessibility.svelte';
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
	/** When true, the window's height isn't user-set or stored — it flows with its content via CSS, leaving only width resizable. */
	autoHeight?: boolean;
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
		component: () => import('@components/widgets/about/About.svelte'),
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
		id: 'accessibility',
		title: 'Accessibility Statement',
		icon: IconAccessibility,
		component: () => import('@widgets/accessibility/Accessibility.svelte'),
		route: '/accessibility',
		defaultWidth: 420,
		defaultHeight: 360,
		defaultX: 160,
		defaultY: 80,
		resizable: true,
		minimal: false,
		description: 'Accessibility statement for this site.'
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
		id: 'folderdetail',
		// Fallback only — resolveDynamicTitle swaps in the real folder's title
		// (and widgetNavigationData synthesizes one nav entry per folder, each
		// with its own title) once an actual id is known.
		title: 'Folder',
		icon: IconFolders,
		component: () => import('@widgets/folders/FolderDetail.svelte'),
		route: '/[id]',
		// Excluded from the generic nav builder — there's no single fixed
		// route for a dynamic widget with many real instances, so
		// widgetNavigationData synthesizes one nav entry per folder instead.
		navigable: false,
		defaultWidth: 400,
		defaultHeight: 420,
		defaultX: 140,
		defaultY: 70,
		resizable: true,
		minimal: false,
		description: 'A folder of cute pictures.'
	},
	{
		id: 'photoviewer',
		title: 'Photo',
		icon: IconFolders,
		component: () => import('@widgets/folders/PhotoViewer.svelte'),
		route: '/[id]/[photoId]',
		// Starting width only — the window is user-resizable, and height
		// always flows with the image's own aspect ratio via autoHeight.
		defaultWidth: 480,
		defaultHeight: 560,
		// To the right of the About window (x: 80..560), not stacked on top of it.
		defaultX: 620,
		defaultY: 60,
		resizable: true,
		autoHeight: true,
		minimal: false,
		description: 'A cute picture.'
	}
];
