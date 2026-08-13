#!/usr/bin/env node
// Auto-optimize oversized raster images *in place*.
//
// Walks the repo for PNG/JPG/WebP/GIF assets larger than MAX_BYTES and shrinks
// each below the budget using ImageMagick, keeping the same filename and format
// so nothing that references the file (imports, markdown, CSS) has to change.
//
// This is a *fixer*, not a gate: it always exits 0. The autofix workflow runs
// it, then commits whatever changed. Run locally with `pnpm run optimize:images`.
//
// Requires the `magick` (ImageMagick v7) CLI on PATH.

import { execFileSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { join, relative, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

/** Budget: images at or below this are left untouched. */
const MAX_BYTES = 500 * 1024;

/** Directories to scan, relative to the repo root. */
const SCAN_DIRS = ['static', 'src'];

/** Never touch these (repo-relative paths). The wallpaper is exempt by design. */
const EXCLUDE = new Set(['static/bg.webp']);

/** Raster formats we can re-encode in place. */
const EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);

// Compression ladder: try each step in order until the file fits the budget.
// Each step caps the longest edge and (for lossy formats) drops quality. PNGs
// are lossless, so the resize is what shrinks them; the last steps posterize
// the palette as a fallback for stubborn screenshots.
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

/** Re-encode `file` with the given ladder step, in place. */
function encode(file, ext, { maxDim, quality, colors }) {
	const args = [file, '-strip', '-resize', `${maxDim}x${maxDim}>`];
	if (ext === '.gif') {
		// Preserve animation: coalesce frames, then re-optimize.
		args.unshift('-coalesce');
		args.push('-layers', 'optimize');
	}
	if (colors > 0) args.push('-colors', String(colors));
	if (ext === '.png') {
		args.push('-define', 'png:compression-level=9', '-define', 'png:compression-filter=5');
	} else if (ext !== '.gif') {
		args.push('-quality', String(quality));
	}
	args.push(file);
	execFileSync('magick', args, { stdio: 'pipe' });
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
	const before = statSync(file).size;
	for (const step of LADDER) {
		encode(file, ext, step);
		if (statSync(file).size <= MAX_BYTES) break;
	}
	const after = statSync(file).size;
	if (after <= MAX_BYTES) {
		fixed++;
		console.log(`✓ ${rel}: ${fmtKB(before)} → ${fmtKB(after)}`);
	} else {
		stubborn++;
		console.log(`⚠ ${rel}: ${fmtKB(before)} → ${fmtKB(after)} (still over ${fmtKB(MAX_BYTES)})`);
	}
}

console.log(`\nOptimized ${fixed} image(s); ${stubborn} still over budget.`);
process.exit(0);
