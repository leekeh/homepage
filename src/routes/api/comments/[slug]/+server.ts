import type { RequestHandler } from '@sveltejs/kit';

type DirectComment = {
	id: string;
	name: string;
	Content: string;
	Timestamp: string;
};

export const POST: RequestHandler = async ({ request, platform, params }) => {
	if (!platform?.env?.DB) {
		return Response.json({ error: 'Database connection not available' }, { status: 500 });
	}

	const { slug } = params;

	let body: { name?: unknown; content?: unknown };
	try {
		body = await request.json();
	} catch {
		return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
	}

	const { name, content } = body;

	if (typeof name !== 'string' || !name.trim() || name.length > 100) {
		return Response.json(
			{ error: 'name must be a non-empty string (max 100 characters)' },
			{ status: 400 }
		);
	}
	if (typeof content !== 'string' || !content.trim()) {
		return Response.json({ error: 'content must be a non-empty string' }, { status: 400 });
	}
	if (!slug || slug.length > 100) {
		return Response.json({ error: 'Invalid post slug' }, { status: 400 });
	}

	const id = crypto.randomUUID();
	const timestamp = new Date().toISOString();

	await platform.env.DB.prepare(
		'INSERT INTO direct_comments (id, name, Content, Timestamp, Approved, PostSlug) VALUES (?, ?, ?, ?, ?, ?)'
	)
		.bind(id, name.trim(), content.trim(), timestamp, 0, slug)
		.run();

	return Response.json({ success: true, id }, { status: 201 });
};

export const GET: RequestHandler = async ({ platform, params }) => {
	if (!platform?.env?.DB) {
		return Response.json({ error: 'Database connection not available' }, { status: 500 });
	}

	const { slug } = params;

	if (!slug || slug.length > 100) {
		return Response.json({ error: 'Invalid post slug' }, { status: 400 });
	}

	const { results } = await platform.env.DB.prepare(
		'SELECT id, name, Content, Timestamp FROM direct_comments WHERE PostSlug = ? AND Approved = 1 ORDER BY Timestamp DESC'
	)
		.bind(slug)
		.all<DirectComment>();

	return Response.json(results, {
		headers: {
			'Cache-Control': 'public, max-age=300, s-maxage=300'
		}
	});
};
