/**
 * One-off generator for placeholder aquarium sprites.
 * These are intentionally simple — swap the PNGs in
 * src/components/widgets/aquarium/assets/{fish,plants} with your own art.
 *
 * Run once with: node scripts/gen-aquarium-placeholders.mjs
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const fishDir = join(root, 'src/components/widgets/aquarium/assets/fish');
const plantDir = join(root, 'src/components/widgets/aquarium/assets/plants');

/** Simple side-view fish facing right, tail on the left. */
function fishSvg({ body, fin, eye = '#1a1a1a' }) {
	return `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="72" viewBox="0 0 128 72">
	<g>
		<polygon points="8,36 34,18 34,54" fill="${fin}"/>
		<ellipse cx="70" cy="36" rx="42" ry="24" fill="${body}"/>
		<path d="M96 22 Q108 30 104 36 Q108 42 96 50 Z" fill="${fin}"/>
		<path d="M60 12 Q70 4 82 14 Z" fill="${fin}"/>
		<circle cx="98" cy="30" r="5" fill="#fff"/>
		<circle cx="99" cy="30" r="2.5" fill="${eye}"/>
	</g>
</svg>`;
}

/** Simple seaweed plant anchored at the bottom. */
function plantSvg({ leaf }) {
	return `<svg xmlns="http://www.w3.org/2000/svg" width="72" height="128" viewBox="0 0 72 128">
	<g fill="${leaf}">
		<path d="M36 128 C 18 100 20 70 34 44 C 40 60 40 80 36 128 Z"/>
		<path d="M36 128 C 52 104 54 74 44 40 C 36 62 34 88 36 128 Z"/>
		<path d="M36 128 C 30 96 28 60 36 24 C 44 60 42 96 36 128 Z"/>
	</g>
</svg>`;
}

const targets = [
	[join(fishDir, 'orange.png'), fishSvg({ body: '#ff8c42', fin: '#ff5e1a' })],
	[join(fishDir, 'blue.png'), fishSvg({ body: '#4aa3df', fin: '#2b6cb0' })],
	[join(fishDir, 'yellow.png'), fishSvg({ body: '#ffd24a', fin: '#f0a500' })],
	[join(plantDir, 'seaweed.png'), plantSvg({ leaf: '#2f9e44' })],
	[join(plantDir, 'kelp.png'), plantSvg({ leaf: '#1b7a3d' })]
];

for (const [out, svg] of targets) {
	await sharp(Buffer.from(svg)).png().toFile(out);
	console.log('wrote', out);
}
