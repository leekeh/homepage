import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const prerender = false;

type Comment = {
	id: string;
	name: string;
	Content: string;
	Timestamp: string;
};

export const actions: Actions = {
	comment: async ({ request, platform, params }) => {
		if (!platform?.env?.DB) {
			return fail(500, { error: 'Database connection not available' });
		}

		const { slug } = params;

		const data = await request.formData();
		const name = data.get('name');
		const content = data.get('content');

		if (typeof name !== 'string' || !name.trim() || name.length > 100) {
			return fail(400, { error: 'Name must be a non-empty string (max 100 characters)' });
		}
		if (typeof content !== 'string' || !content.trim()) {
			return fail(400, { error: 'Comment must not be empty' });
		}
		if (!slug || slug.length > 100) {
			return fail(400, { error: 'Invalid post slug' });
		}

		const id = crypto.randomUUID();
		const timestamp = new Date().toISOString();

		await platform.env.DB.prepare(
			'INSERT INTO direct_comments (id, name, Content, Timestamp, Approved, PostSlug) VALUES (?, ?, ?, ?, ?, ?)'
		)
			.bind(id, name.trim(), content.trim(), timestamp, 0, slug)
			.run();

		return { success: true };
	}
};

export const load: PageServerLoad = async ({ platform, params }) => {
	const { slug } = params;
	let initialComments: Comment[] = [];

	if (platform?.env?.DB) {
		// Comments are non-essential: if the query fails (e.g. the table isn't
		// provisioned in preview/CI, or the DB is unavailable), still render the
		// post with an empty comment list rather than crashing the page.
		try {
			const { results } = await platform.env.DB.prepare(
				'SELECT id, name, Content, Timestamp FROM direct_comments WHERE PostSlug = ? AND Approved = 1 ORDER BY Timestamp DESC'
			)
				.bind(slug)
				.all<Comment>();
			initialComments = results;
		} catch (error) {
			console.error('Failed to load comments for %s:', slug, error);
		}
	}

	return { initialComments };
};
