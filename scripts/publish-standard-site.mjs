#!/usr/bin/env node
// Publishes standard.site records (site.standard.publication + one
// site.standard.document per blog post) to your atproto PDS.
//
// Design goals (see the standard.site setup discussion):
//   - Nothing is hand-authored into post frontmatter. Publish dates come from
//     git history and cover images from the colocated og.png, exactly like the
//     site build derives them.
//   - The only persisted artifact is src/content/blog/standard-site-records.json
//     (slug -> AT-URI, plus a `_publication` entry). It doubles as the record
//     the SvelteKit build reads to emit <link rel="site.standard.document"> tags.
//   - Record keys are TIDs assigned by the PDS, so that map is unavoidable; it
//     is generated data, never edited by hand.
//
// Auth is an app password (Bluesky -> Settings -> Privacy and Security). The PDS
// signs the repo commits; we never handle signing keys.
//
// Usage:
//   ATP_IDENTIFIER=leekeh.com ATP_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx \
//     node scripts/publish-standard-site.mjs
//   Add DRY_RUN=1 to preview without writing anything to the PDS or disk.

import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync, statSync, unlinkSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { glob } from 'node:fs/promises';
import matter from 'gray-matter';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const POSTS_DIR = join(REPO_ROOT, 'src/content/blog/posts');
const RECORDS_PATH = join(REPO_ROOT, 'src/content/blog/standard-site-records.json');
const WELLKNOWN_PATH = join(REPO_ROOT, 'static/.well-known/site.standard.publication');
const COVER_MAX_BYTES = 1_000_000; // lexicon: coverImage must be < 1MB

const SITE_URL = (process.env.PUBLIC_SITE_URL || 'https://www.leekeh.com').replace(/\/+$/, '');
const IDENTIFIER = process.env.ATP_IDENTIFIER || 'leekeh.com';
const APP_PASSWORD = process.env.ATP_APP_PASSWORD;
const DRY_RUN = process.env.DRY_RUN === '1';

// site.standard.theme.color#rgb union member from a #rrggbb string.
function rgb(hex) {
	const n = parseInt(hex.replace('#', ''), 16);
	return {
		$type: 'site.standard.theme.color#rgb',
		r: (n >> 16) & 255,
		g: (n >> 8) & 255,
		b: n & 255
	};
}

const PUBLICATION = {
	url: SITE_URL,
	name: process.env.PUBLIC_SITE_NAME || 'leekeh',
	description:
		process.env.PUBLIC_SITE_DESCRIPTION ||
		'Digital trinkets and personal ramblings by a Dutch web developer named Lieke.',
	// basicTheme lets reader apps tint content to match the site. Only `accent`
	// (links/button backgrounds) is set — matching the theme-color in app.html.
	// background/foreground/accentForeground can be added here for a fuller palette.
	basicTheme: { accent: rgb('#E1C8F9') }
};

const log = (...a) => console.log(...a);
const warn = (...a) => console.warn('⚠ ', ...a);

// --- atproto plumbing (plain fetch, no SDK) -------------------------------

async function xrpc(pds, nsid, { method = 'POST', token, body, contentType } = {}) {
	const headers = {};
	if (token) headers.authorization = `Bearer ${token}`;
	let payload;
	if (body instanceof Uint8Array) {
		headers['content-type'] = contentType;
		payload = body;
	} else if (body !== undefined) {
		headers['content-type'] = 'application/json';
		payload = JSON.stringify(body);
	}
	const url =
		method === 'GET' ? `${pds}/xrpc/${nsid}?${new URLSearchParams(body)}` : `${pds}/xrpc/${nsid}`;
	const res = await fetch(url, {
		method,
		headers,
		body: method === 'GET' ? undefined : payload
	});
	if (!res.ok) {
		throw new Error(`${nsid} -> ${res.status} ${res.statusText}: ${await res.text()}`);
	}
	return res.json();
}

async function resolvePds(identifier) {
	const did = identifier.startsWith('did:')
		? identifier
		: (
				await (
					await fetch(
						`https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle?handle=${identifier}`
					)
				).json()
			).did;
	const doc = await (await fetch(`https://plc.directory/${did}`)).json();
	const svc = doc.service?.find(
		(s) => s.id === '#atproto_pds' || s.type === 'AtprotoPersonalDataServer'
	);
	if (!svc) throw new Error(`no PDS in DID document for ${did}`);
	return { did, pds: svc.serviceEndpoint };
}

// --- post discovery (mirrors src/content/blog/server.ts) ------------------

function slugFromPath(absPath) {
	const rel = relative(POSTS_DIR, absPath).split('\\').join('/');
	return rel.split('/').slice(0, -1).join('/');
}

function gitPublishDate(absPath) {
	try {
		const out = execFileSync(
			'git',
			['log', '--diff-filter=A', '--follow', '--format=%aI', '--', absPath],
			{ cwd: REPO_ROOT, encoding: 'utf8' }
		).trim();
		const first = out.split('\n').filter(Boolean).at(-1);
		return first || null;
	} catch {
		return null;
	}
}

function normalizeTags(meta) {
	const cats = (meta.categories ?? []).map((c) => c.toLowerCase().trim().replace(/\s+/g, '-'));
	const tags = (meta.tags ?? []).map((t) => t.toLowerCase().trim());
	return [...new Set([...cats, ...tags])];
}

// --- cover image handling -------------------------------------------------

const tempFiles = [];

// ImageMagick 7 uses `magick`, 6 uses `convert`. Both are preinstalled on
// GitHub-hosted runners; locally you may need to install one. Returns null when
// neither is available, in which case oversized covers are simply skipped.
let convertBinCache;
function convertBin() {
	if (convertBinCache !== undefined) return convertBinCache;
	for (const bin of ['magick', 'convert']) {
		try {
			execFileSync(bin, ['-version'], { stdio: 'ignore' });
			return (convertBinCache = bin);
		} catch {
			/* try next */
		}
	}
	return (convertBinCache = null);
}

// Downscale an oversized cover into a temporary JPEG under the size limit,
// without touching the source file. Returns the temp path, or null if it can't.
function shrinkCover(srcPath) {
	const bin = convertBin();
	if (!bin) return null;
	const out = join(tmpdir(), `stdsite-${basename(srcPath, '.png')}-${tempFiles.length}.jpg`);
	for (const quality of [82, 70, 55, 40]) {
		try {
			execFileSync(
				bin,
				[srcPath, '-resize', '1200x1200>', '-strip', '-quality', String(quality), out],
				{
					stdio: 'ignore'
				}
			);
		} catch {
			return null;
		}
		if (statSync(out).size <= COVER_MAX_BYTES) {
			tempFiles.push(out);
			return out;
		}
	}
	return null;
}

// Resolve the colocated og.png into an uploadable cover, resizing if needed.
// Returns { path, mime, src } where `src` is the original file (used for change
// detection) or null when there is no usable cover.
function resolveCover(slug, postDir) {
	const src = join(postDir, 'og.png');
	if (!existsSync(src)) return null;
	if (statSync(src).size <= COVER_MAX_BYTES) return { path: src, mime: 'image/png', src };
	const resized = shrinkCover(src);
	if (resized) return { path: resized, mime: 'image/jpeg', src };
	warn(
		`${slug}: og.png exceeds 1MB and could not be resized (ImageMagick missing?); skipping cover`
	);
	return null;
}

async function collectPosts() {
	const posts = [];
	for await (const entry of glob('**/*.mdx', { cwd: POSTS_DIR })) {
		const rel = entry.split('\\').join('/');
		if (rel.startsWith('drafts/')) continue; // never publish drafts to the atmosphere
		const absPath = join(POSTS_DIR, entry);
		const { data: meta } = matter(readFileSync(absPath, 'utf8'));
		if (!meta.title) {
			warn(`skipping ${rel}: no title`);
			continue;
		}
		const slug = slugFromPath(absPath);
		const published = meta.date ?? gitPublishDate(absPath);
		if (!published) {
			warn(`skipping ${slug}: no frontmatter date and no git history`);
			continue;
		}
		posts.push({
			slug,
			title: String(meta.title),
			description: meta.description ? String(meta.description) : undefined,
			tags: normalizeTags(meta),
			path: `/blog/${slug}`,
			publishedAt: new Date(published).toISOString(),
			cover: resolveCover(slug, dirname(absPath))
		});
	}
	return posts.sort((a, b) => a.slug.localeCompare(b.slug));
}

// --- record building & change detection -----------------------------------

function contentHash(parts) {
	return createHash('sha256').update(JSON.stringify(parts)).digest('hex');
}

function rkeyOf(uri) {
	return uri.split('/').at(-1);
}

async function main() {
	if (!APP_PASSWORD && !DRY_RUN) {
		console.error('Missing ATP_APP_PASSWORD (or run with DRY_RUN=1 to preview).');
		process.exit(1);
	}

	const posts = await collectPosts();
	const state = existsSync(RECORDS_PATH) ? JSON.parse(readFileSync(RECORDS_PATH, 'utf8')) : {};

	if (DRY_RUN) {
		log(`DRY RUN — ${posts.length} post(s) discovered:`);
		for (const p of posts) {
			log(
				`  ${p.slug}  [${p.publishedAt.slice(0, 10)}]  ${p.cover ? 'cover' : 'no-cover'}  tags=${p.tags.join(',') || '—'}`
			);
		}
		return;
	}

	const { did, pds } = await resolvePds(IDENTIFIER);
	const session = await xrpc(pds, 'com.atproto.server.createSession', {
		body: { identifier: IDENTIFIER, password: APP_PASSWORD }
	});
	const token = session.accessJwt;
	log(`Authenticated as ${session.handle} (${did}) on ${pds}`);

	const put = (collection, record, rkey) =>
		xrpc(pds, rkey ? 'com.atproto.repo.putRecord' : 'com.atproto.repo.createRecord', {
			token,
			body: rkey ? { repo: did, collection, rkey, record } : { repo: did, collection, record }
		});

	// 1. Publication record (create once, update if metadata changed).
	const pubHash = contentHash(PUBLICATION);
	if (!state._publication || state._publication.hash !== pubHash) {
		const rkey = state._publication ? rkeyOf(state._publication.uri) : undefined;
		const res = await put(
			'site.standard.publication',
			{ $type: 'site.standard.publication', ...PUBLICATION },
			rkey
		);
		state._publication = { uri: res.uri, cid: res.cid, hash: pubHash };
		log(`${rkey ? 'Updated' : 'Created'} publication ${res.uri}`);
	}
	const publicationUri = state._publication.uri;

	// 2. Document records.
	let created = 0,
		updated = 0,
		skipped = 0;
	for (const p of posts) {
		let coverHash = null;
		if (p.cover) coverHash = createHash('sha256').update(readFileSync(p.cover.src)).digest('hex');

		const hash = contentHash({
			site: publicationUri,
			title: p.title,
			path: p.path,
			publishedAt: p.publishedAt,
			description: p.description,
			tags: p.tags,
			coverHash
		});

		const prev = state[p.slug];
		if (prev && prev.hash === hash) {
			skipped++;
			continue;
		}

		let coverImage;
		if (p.cover) {
			const blobRes = await xrpc(pds, 'com.atproto.repo.uploadBlob', {
				token,
				body: new Uint8Array(readFileSync(p.cover.path)),
				contentType: p.cover.mime
			});
			coverImage = blobRes.blob;
		}

		const record = {
			$type: 'site.standard.document',
			site: publicationUri,
			title: p.title,
			path: p.path,
			publishedAt: p.publishedAt
		};
		if (p.description) record.description = p.description;
		if (p.tags.length) record.tags = p.tags;
		if (coverImage) record.coverImage = coverImage;

		const rkey = prev ? rkeyOf(prev.uri) : undefined;
		const res = await put('site.standard.document', record, rkey);
		state[p.slug] = { uri: res.uri, cid: res.cid, hash };
		if (rkey) {
			updated++;
			log(`Updated ${p.slug}`);
		} else {
			created++;
			log(`Created ${p.slug} -> ${res.uri}`);
		}
	}

	// 3. Persist state + the well-known verification file.
	const ordered = Object.fromEntries(Object.entries(state).sort(([a], [b]) => a.localeCompare(b)));
	writeFileSync(RECORDS_PATH, JSON.stringify(ordered, null, '\t') + '\n');
	mkdirSync(dirname(WELLKNOWN_PATH), { recursive: true });
	writeFileSync(WELLKNOWN_PATH, publicationUri + '\n');

	log(`\nDone. created=${created} updated=${updated} skipped=${skipped}`);
}

main()
	.catch((err) => {
		console.error(err);
		process.exitCode = 1;
	})
	.finally(() => {
		for (const f of tempFiles) {
			try {
				unlinkSync(f);
			} catch {
				/* best effort */
			}
		}
	});
