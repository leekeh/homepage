// The visual diary of sweet treats, newest last. Ported from the standalone
// sweet-treat-saturday project. Add an entry by appending to `treats`.
// `locationId` must match a key in the `locations` map below.
// Each entry maps to `/models/treats/{imgId}.glb` (3D model),
// `/models/treats/{imgId}.webp` (full poster / OG image) and
// `/models/treats/{imgId}-thumb.webp` (grid thumbnail).

export interface Treat {
	title: string;
	imgId: string;
	locationId: string;
	/** Numeric string, or "??" when unknown. */
	price?: string;
	/** ISO date, e.g. "2025-09-27". */
	date: string;
	review: string;
}

export interface Location {
	name: string;
	url: string;
	maps: string;
}

export const locations: Record<string, Location> = {
	pompernikkel: {
		name: 'Pompernikkel',
		url: 'https://pompernikkel.nl/',
		maps: 'https://www.google.com/maps/place/Pompernikkel/@52.0776368,4.2752531,17z/data=!3m1!4b1!4m6!3m5!1s0x47c5b1d3ab377b73:0x3a0ae481edb7f6fa!8m2!3d52.0776335!4d4.277828!16s%2Fg%2F11fr2t79n0?entry=ttu&g_ep=EgoyMDI1MDkyNC4wIKXMDSoASAFQAw%3D%3D'
	},
	afternoon: {
		name: 'Afternoon',
		url: 'https://www.tiktok.com/@afternoondesserts',
		maps: 'https://www.google.com/maps/place/Afternoon/@52.0769668,4.3129775,17z/data=!3m1!4b1!4m6!3m5!1s0x47c5b70077f10b4f:0x3b5a4236b3d5d841!8m2!3d52.0769635!4d4.3155524!16s%2Fg%2F11xg4s1wrg?entry=ttu&g_ep=EgoyMDI1MTAwMS4wIKXMDSoASAFQAw%3D%3D'
	}
};

export const treats: Treat[] = [
	{
		title: 'Cinnamon roll with miso and pepper',
		imgId: 'cinnamon-bun',
		locationId: 'pompernikkel',
		price: '3.5',
		date: '2025-09-27',
		review:
			"Althought the miso and pepper don't really jump out, the pastry as a whole still was very pleasant. It is crunchy on the outside and fluffy on the inside, and the taste is nicely balanced. Perhaps there is a slight umami undertone thanks to the miso."
	},
	{
		title: 'Pastry with fig and cinnamon custard',
		imgId: 'fig-danish',
		locationId: 'pompernikkel',
		price: undefined,
		date: '2025-09-27',
		review:
			'There was extra fig under the custard. The custard flavor was a bit subtle, and could have been more pronounced. The pastry itself was nice and flaky, but it was missing some wow.'
	},
	{
		title: 'Milk cake',
		imgId: 'tres-leches',
		locationId: 'afternoon',
		price: '7',
		date: '2025-10-04',
		review:
			"This was the first time I tried a tres leches cake, and I'm not sure it is my thing. The flavor is agreeable, and I dont mind the moist texture, but it is just not something that special to me. It was also a bit on the sweet side."
	},
	{
		title: 'San Sebastian Cheesecake',
		imgId: 'basque-cheesecake',
		locationId: 'afternoon',
		price: '7.5',
		date: '2025-10-04',
		review:
			"I was not expecting to like this as much as I did. The cake comes with a chocolate sauce, and although it is very sweet, it balances well with the slightly savory and acidic flavor of the cheesecake. I'm not sure I could eat a whole slice in one go, thought. But that gives me some extra for tomorrow."
	}
];

const dateFormatter = new Intl.DateTimeFormat('en', {
	year: 'numeric',
	month: 'long',
	day: 'numeric',
	weekday: 'long'
});

// Build the Date from its parts so "2025-09-27" is treated as a local date.
// `new Date("2025-09-27")` parses as UTC midnight and can render as the
// previous day in western timezones.
export function formatDate(date: string): string {
	const [year, month, day] = date.split('-').map(Number);
	if (!year || !month || !day) return date;
	return dateFormatter.format(new Date(year, month - 1, day));
}

export function formatPrice(price: string): string {
	const amount = Number(price);
	return Number.isFinite(amount) && price.trim() !== '' ? `€${amount.toFixed(2)}` : 'price unknown';
}

export function getTreatById(imgId: string): Treat | undefined {
	return treats.find((treat) => treat.imgId === imgId);
}

export function modelSrc(imgId: string): string {
	return `/models/treats/${imgId}.glb`;
}

/** Full-size WebP poster — used both on-page (model-viewer, noscript) and as the OG/social image. */
export function posterWebp(imgId: string): string {
	return `/models/treats/${imgId}.webp`;
}

/** Small WebP thumbnail for the treats grid. */
export function thumbSrc(imgId: string): string {
	return `/models/treats/${imgId}-thumb.webp`;
}
