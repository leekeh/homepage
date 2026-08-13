#!/usr/bin/env node
// Auto-optimize oversized raster images *in place*.
//
// Walks the repo for PNG/JPG/WebP/GIF assets larger than MAX_BYTES and shrinks
// each below the budget, keeping the same filename and format so nothing that
// references the file (imports, markdown, CSS) has to change.
//
// Uses `sharp` — a self-contained npm dependency (pinned in the lockfile), so
// this runs identically on any machine or CI runner with no system tools to
// install. This is a *fixer*, not a gate: it always exits 0. The autofix
// workflow runs it, then commits whatever changed. Run locally with
// `pnpm run optimize:images`.

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

/** Budget: images at or below this are left untouched. */
const MAX_BYTES = 500 * 1024;

/** Directories to scan, relative to the repo root. */
const SCAN_DIRS = ['static', 'src'];

/** Never touch these (repo-relative paths). The wallpaper is exempt by design. */
const EXCLUDE = new Set(['static/bg.webp']);

/** Raster formats we can re-encode in place. */
const EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);

// Compression ladder: try each step against the *original* bytes until one fits
// the budget. Each step caps the longest edge and (for lossy formats) drops
// quality. PNGs are lossless, so the resize is what shrinks them; the last step
// palettizes as a fallback for stubborn screenshots.
const LADDER = [
	{ maxDim: 2000, quality: 85, colors: 0 },
	{ maxDim: 1600, quality: 80, colors: 0 },
	{ maxDim: 1280, quality: 72, colors: 0 },
	{ maxDim: 1024, quality: 65, colors: 0 },
	{ maxDim: 900, quality: 60, colors: 256 }
];

function walk(dir) {
	const out = [];
	let entries;
	try {
		entries = readdirSync(dir, { withFileTypes: true });
	} catch {
		return out;
	}
	for (const entry of entries) {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) {
			if (entry.name === 'node_modules' || entry.name === '.git') continue;
			out.push(...walk(full));
		} else if (entry.isFile() && EXTS.has(extname(entry.name).toLowerCase())) {
			out.push(full);
		}
	}
	return out;
}

function fmtKB(bytes) {
	return `${Math.round(bytes / 1024)} KB`;
}

/**
 * Re-encode `original` (a Buffer) at the given ladder step, preserving format.
 * sharp strips metadata by default, so no explicit `-strip` is needed.
 */
async function encode(original, ext, { maxDim, quality, colors }) {
	// `animated: true` keeps every frame of animated GIFs/WebPs.
	let img = sharp(original, { animated: ext === '.gif' || ext === '.webp' }).resize({
		width: maxDim,
		height: maxDim,
		fit: 'inside',
		withoutEnlargement: true
	});

	switch (ext) {
		case '.png':
			img = img.png({
				compressionLevel: 9,
				palette: colors > 0,
				colors: colors || undefined,
				quality
			});
			break;
		case '.jpg':
		case '.jpeg':
			img = img.jpeg({ quality, mozjpeg: true });
			break;
		case '.webp':
			img = img.webp({ quality });
			break;
		case '.gif':
			img = img.gif(colors > 0 ? { colours: colors } : {});
			break;
	}
	return img.toBuffer();
}

const candidates = SCAN_DIRS.flatMap((d) => walk(join(ROOT, d)))
	.map((file) => ({ file, rel: relative(ROOT, file).split(sep).join('/') }))
	.filter(({ rel }) => !EXCLUDE.has(rel))
	.filter(({ file }) => statSync(file).size > MAX_BYTES)
	.sort((a, b) => a.rel.localeCompare(b.rel));

if (candidates.length === 0) {
	console.log(`All images are within the ${fmtKB(MAX_BYTES)} budget. Nothing to do.`);
	process.exit(0);
}

let fixed = 0;
let stubborn = 0;
for (const { file, rel } of candidates) {
	const ext = extname(file).toLowerCase();
	const original = readFileSync(file);
	const before = original.length;

	// Descend the ladder against the pristine original; stop at the first fit.
	// The ladder shrinks monotonically, so the last step is the smallest — keep
	// it as the fallback even when nothing fits.
	let best;
	for (const step of LADDER) {
		best = await encode(original, ext, step);
		if (best.length <= MAX_BYTES) break;
	}

	writeFileSync(file, best);
	if (best.length <= MAX_BYTES) {
		fixed++;
		console.log(`✓ ${rel}: ${fmtKB(before)} → ${fmtKB(best.length)}`);
	} else {
		stubborn++;
		console.log(
			`⚠ ${rel}: ${fmtKB(before)} → ${fmtKB(best.length)} (still over ${fmtKB(MAX_BYTES)})`
		);
	}
}

console.log(`\nOptimized ${fixed} image(s); ${stubborn} still over budget.`);
process.exit(0);
