import { describe, expect, it } from 'vitest';
import { createD1Mock, type D1Mock } from '@utils/testing/d1-mock';
import { GET, POST } from './+server';

/** Build the minimal RequestEvent shape the handlers actually read. */
function event(opts: { slug?: string; db?: D1Mock | null; body?: unknown; rawBody?: string }) {
	const platform = opts.db === null ? {} : { env: { DB: opts.db ?? createD1Mock() } };
	const request = new Request('http://localhost/api/comments/test', {
		method: 'POST',
		body: opts.rawBody ?? (opts.body === undefined ? undefined : JSON.stringify(opts.body))
	});
	// The handlers only use { request, platform, params }; cast the rest away.
	return {
		request,
		platform,
		params: { slug: opts.slug ?? 'hello-world' }
	} as unknown as Parameters<typeof POST>[0];
}

describe('POST /api/comments/[slug]', () => {
	it('inserts an unapproved comment and returns 201 with its id', async () => {
		const db = createD1Mock();
		const res = await POST(event({ db, body: { name: 'Ada', content: 'Nice post!' } }));

		expect(res.status).toBe(201);
		const json = (await res.json()) as { success: boolean; id: string };
		expect(json.success).toBe(true);

		expect(db.rows).toHaveLength(1);
		expect(db.rows[0]).toMatchObject({
			id: json.id,
			name: 'Ada',
			Content: 'Nice post!',
			// New comments are held for moderation.
			Approved: 0,
			PostSlug: 'hello-world'
		});
	});

	it('trims whitespace around name and content before storing', async () => {
		const db = createD1Mock();
		await POST(event({ db, body: { name: '  Ada  ', content: '  hi  ' } }));

		expect(db.rows[0]).toMatchObject({ name: 'Ada', Content: 'hi' });
	});

	it('returns 500 when the database binding is missing', async () => {
		const res = await POST(event({ db: null, body: { name: 'Ada', content: 'hi' } }));
		expect(res.status).toBe(500);
	});

	it('returns 400 on invalid JSON', async () => {
		const res = await POST(event({ rawBody: 'not json' }));
		expect(res.status).toBe(400);
	});

	it.each([
		['empty name', { name: '   ', content: 'hi' }],
		['missing name', { content: 'hi' }],
		['over-long name', { name: 'a'.repeat(101), content: 'hi' }],
		['empty content', { name: 'Ada', content: '   ' }],
		['missing content', { name: 'Ada' }]
	])('returns 400 and stores nothing for %s', async (_label, body) => {
		const db = createD1Mock();
		const res = await POST(event({ db, body }));

		expect(res.status).toBe(400);
		expect(db.rows).toHaveLength(0);
	});

	it('returns 400 for an over-long slug', async () => {
		const db = createD1Mock();
		const res = await POST(
			event({ db, slug: 'a'.repeat(101), body: { name: 'Ada', content: 'hi' } })
		);

		expect(res.status).toBe(400);
		expect(db.rows).toHaveLength(0);
	});
});

describe('GET /api/comments/[slug]', () => {
	it('returns only approved comments for the slug, newest first', async () => {
		const db = createD1Mock();
		db.seed(
			{
				id: '1',
				name: 'Old',
				Content: 'first',
				Timestamp: '2024-01-01T00:00:00.000Z',
				Approved: 1,
				PostSlug: 'hello-world'
			},
			{
				id: '2',
				name: 'New',
				Content: 'second',
				Timestamp: '2024-02-01T00:00:00.000Z',
				Approved: 1,
				PostSlug: 'hello-world'
			},
			{
				id: '3',
				name: 'Pending',
				Content: 'hidden',
				Timestamp: '2024-03-01T00:00:00.000Z',
				Approved: 0,
				PostSlug: 'hello-world'
			},
			{
				id: '4',
				name: 'OtherPost',
				Content: 'elsewhere',
				Timestamp: '2024-04-01T00:00:00.000Z',
				Approved: 1,
				PostSlug: 'another-post'
			}
		);

		const res = await GET(event({ db }));
		expect(res.status).toBe(200);
		expect(res.headers.get('Cache-Control')).toContain('max-age=300');

		const comments = (await res.json()) as { id: string }[];
		expect(comments.map((c) => c.id)).toEqual(['2', '1']);
	});

	it('returns 500 when the database binding is missing', async () => {
		const res = await GET(event({ db: null }));
		expect(res.status).toBe(500);
	});
});
