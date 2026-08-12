import { describe, expect, it } from 'vitest';
import { createD1Mock, type D1Mock } from '@utils/testing/d1-mock';
import { actions, load } from './+page.server';

const comment = actions.comment;

function formEvent(opts: { slug?: string; db?: D1Mock | null; fields?: Record<string, string> }) {
	const platform = opts.db === null ? {} : { env: { DB: opts.db ?? createD1Mock() } };
	const data = new FormData();
	for (const [key, value] of Object.entries(opts.fields ?? {})) {
		data.set(key, value);
	}
	const request = { formData: async () => data } as Request;
	return {
		request,
		platform,
		params: { slug: opts.slug ?? 'hello-world' }
	} as unknown as Parameters<typeof comment>[0];
}

function loadEvent(opts: { slug?: string; db?: D1Mock | null }) {
	const platform = opts.db === null ? {} : { env: { DB: opts.db ?? createD1Mock() } };
	return { platform, params: { slug: opts.slug ?? 'hello-world' } } as unknown as Parameters<
		typeof load
	>[0];
}

// `load` is typed to allow returning `void`; our implementation always resolves
// to `{ initialComments }`, so narrow it for the assertions below.
type LoadResult = { initialComments: { id: string; name: string }[] };
const loadComments = (e: Parameters<typeof load>[0]) => load(e) as Promise<LoadResult>;

describe('comment action', () => {
	it('stores an unapproved comment and reports success', async () => {
		const db = createD1Mock();
		const result = await comment(formEvent({ db, fields: { name: 'Ada', content: 'Great read' } }));

		expect(result).toEqual({ success: true });
		expect(db.rows[0]).toMatchObject({
			name: 'Ada',
			Content: 'Great read',
			Approved: 0,
			PostSlug: 'hello-world'
		});
	});

	it('fails with 500 when the database binding is missing', async () => {
		const result = await comment(formEvent({ db: null, fields: { name: 'Ada', content: 'hi' } }));
		expect(result).toMatchObject({ status: 500 });
	});

	it.each([
		['empty name', { name: '  ', content: 'hi' }],
		['empty content', { name: 'Ada', content: '  ' }]
	])('fails with 400 and stores nothing for %s', async (_label, fields) => {
		const db = createD1Mock();
		const result = await comment(formEvent({ db, fields }));

		expect(result).toMatchObject({ status: 400 });
		expect(db.rows).toHaveLength(0);
	});
});

describe('blog post load', () => {
	it('returns approved comments for the slug', async () => {
		const db = createD1Mock();
		db.seed({
			id: '1',
			name: 'Ada',
			Content: 'hi',
			Timestamp: '2024-01-01T00:00:00.000Z',
			Approved: 1,
			PostSlug: 'hello-world'
		});

		const { initialComments } = await loadComments(loadEvent({ db }));
		expect(initialComments).toHaveLength(1);
		expect(initialComments[0]).toMatchObject({ id: '1', name: 'Ada' });
	});

	it('returns an empty list when the database binding is missing', async () => {
		const { initialComments } = await loadComments(loadEvent({ db: null }));
		expect(initialComments).toEqual([]);
	});

	it('returns an empty list when the query fails (e.g. table not provisioned)', async () => {
		// A DB binding that throws on query — mirrors preview/CI where the
		// `direct_comments` table doesn't exist. The post must still render.
		const failingDb = {
			prepare: () => ({
				bind: () => ({
					all: async () => {
						throw new Error('D1_ERROR: no such table: direct_comments');
					}
				})
			})
		} as unknown as D1Mock;

		const { initialComments } = await loadComments(loadEvent({ db: failingDb }));
		expect(initialComments).toEqual([]);
	});
});
