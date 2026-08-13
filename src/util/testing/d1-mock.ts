/**
 * A tiny in-memory stand-in for the Cloudflare D1 binding used by the comment
 * handlers. It implements just enough of the `D1Database` surface declared in
 * `src/app.d.ts` — `prepare().bind().run()` and `prepare().bind().all()` — for
 * the two SQL statements the app actually issues (INSERT into `direct_comments`
 * and SELECT approved comments by slug).
 *
 * It is deliberately not a real SQL engine: `run()` appends the bound row to an
 * in-memory list and `all()` returns the approved rows for the queried slug, so
 * tests can exercise the handlers without a live database.
 */

export type CommentRow = {
	id: string;
	name: string;
	Content: string;
	Timestamp: string;
	Approved: number;
	PostSlug: string;
};

export type D1Mock = App.Platform['env']['DB'] & {
	/** Every row inserted via an INSERT statement, in insertion order. */
	readonly rows: CommentRow[];
	/** Seed already-stored rows (e.g. pre-existing approved comments). */
	seed(...rows: CommentRow[]): void;
};

export function createD1Mock(): D1Mock {
	const rows: CommentRow[] = [];

	const db: D1Mock = {
		rows,
		seed(...seeded) {
			rows.push(...seeded);
		},
		prepare(query: string) {
			let bound: unknown[] = [];

			const statement: ReturnType<D1Mock['prepare']> = {
				bind(...values: unknown[]) {
					bound = values;
					return statement;
				},
				async run() {
					if (/^\s*insert into direct_comments/i.test(query)) {
						const [id, name, Content, Timestamp, Approved, PostSlug] = bound;
						rows.push({
							id: String(id),
							name: String(name),
							Content: String(Content),
							Timestamp: String(Timestamp),
							Approved: Number(Approved),
							PostSlug: String(PostSlug)
						});
					}
					return { success: true };
				},
				async all<T = Record<string, unknown>>() {
					const slug = String(bound[0]);
					const results = rows
						.filter((row) => row.PostSlug === slug && row.Approved === 1)
						.sort((a, b) => b.Timestamp.localeCompare(a.Timestamp))
						.map(({ id, name, Content, Timestamp }) => ({ id, name, Content, Timestamp }));
					return { results: results as T[] };
				},
				async first<T = Record<string, unknown>>() {
					const { results } = await statement.all<T>();
					return results[0] ?? null;
				}
			};

			return statement;
		}
	};

	return db;
}
