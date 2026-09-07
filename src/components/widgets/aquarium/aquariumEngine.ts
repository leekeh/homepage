// Imperative canvas engine for the retro aquarium. Browser-only — instantiate
// from onMount. Pure position math lives in ./motion.ts.

import { fish as fishConfig, plants as plantConfig, scene } from './aquarium.config';
import { wrap, depthToY, oscillate, seeded } from './motion';

type Sprite = { img: HTMLImageElement; aspect: number };

type Fish = {
	sprite: Sprite;
	size: number; // height in scene px
	speed: number; // px/sec, always positive
	dir: 1 | -1;
	flip: boolean;
	depth: number;
	bobAmp: number;
	bobPeriod: number;
	phase: number;
	x: number;
};

type Plant = {
	sprite: Sprite;
	size: number;
	x: number; // anchored horizontally
	swayDeg: number;
	swayPeriod: number;
	phase: number;
};

const MARGIN = 8;
const MAX_DT = 0.1; // clamp huge gaps (e.g. background tab) so fish don't teleport

/** Load a unique image once; reused across every instance that shares the src. */
const spriteCache = new Map<string, Sprite>();
function loadSprite(src: string): Sprite {
	let sprite = spriteCache.get(src);
	if (!sprite) {
		const img = new Image();
		sprite = { img, aspect: 1 };
		img.onload = () => {
			if (img.naturalHeight > 0) sprite!.aspect = img.naturalWidth / img.naturalHeight;
		};
		img.src = src;
		spriteCache.set(src, sprite);
	}
	return sprite;
}

export function createAquarium(getCanvas: () => HTMLCanvasElement | null) {
	let ctx: CanvasRenderingContext2D | null = null;
	let buffer: HTMLCanvasElement | null = null;
	let bufferCtx: CanvasRenderingContext2D | null = null;

	let sceneW = 0;
	let sceneH = 0;
	let bw = 0;
	let bh = 0;

	let fish: Fish[] = [];
	let plants: Plant[] = [];
	let built = false;

	let raf = 0;
	let lastTime = 0;
	let clock = 0; // accumulated seconds; frozen under reduced motion

	let reduceMotion = false;
	if (typeof window !== 'undefined' && window.matchMedia) {
		reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	}

	function build() {
		let seed = 1;
		fish = fishConfig.flatMap((cfg) =>
			Array.from({ length: cfg.count }, () => {
				const depthMin = cfg.depthMin ?? 0.1;
				const depthMax = cfg.depthMax ?? 0.9;
				const s = seed++;
				return {
					sprite: loadSprite(cfg.src),
					size: cfg.size,
					speed: cfg.speed,
					dir: seeded(s * 7) < 0.5 ? -1 : 1,
					flip: cfg.flip ?? true,
					depth: depthMin + seeded(s * 3) * (depthMax - depthMin),
					bobAmp: cfg.bob ?? 6,
					bobPeriod: 2.5 + seeded(s * 5) * 2,
					phase: seeded(s * 11) * Math.PI * 2,
					x: seeded(s * 13) // fraction of width; resolved in reset()
				} satisfies Fish;
			})
		);

		plants = plantConfig.flatMap((cfg) =>
			Array.from({ length: cfg.count }, () => {
				const s = seed++;
				return {
					sprite: loadSprite(cfg.src),
					size: cfg.size,
					x: seeded(s * 17), // fraction of width; resolved in reset()
					swayDeg: cfg.sway ?? 6,
					swayPeriod: 3 + seeded(s * 19) * 2,
					phase: seeded(s * 23) * Math.PI * 2
				} satisfies Plant;
			})
		);
		built = true;
	}

	/** Turn the fractional seed positions into absolute px for the current size. */
	function placeEntities() {
		for (const f of fish) {
			// If x is still a 0..1 fraction (initial), scale to width; otherwise keep.
			if (f.x <= 1) f.x = f.x * Math.max(1, sceneW);
			else f.x = wrap(f.x, -f.size * 2, sceneW + f.size * 2);
		}
		for (const p of plants) {
			if (p.x <= 1) p.x = MARGIN + p.x * Math.max(1, sceneW - MARGIN * 2);
			else p.x = Math.min(sceneW - MARGIN, Math.max(MARGIN, p.x));
		}
	}

	function step(dt: number) {
		clock += dt;
		for (const f of fish) {
			const spriteW = f.size * f.sprite.aspect;
			f.x += f.dir * f.speed * dt;
			// Wrap once fully off either edge.
			f.x = wrap(f.x, -spriteW, sceneW + spriteW);
		}
	}

	function draw() {
		if (!ctx || !bufferCtx || !buffer) return;

		bufferCtx.setTransform(1, 0, 0, 1, 0, 0);
		bufferCtx.clearRect(0, 0, bw, bh);

		if (scene.waterTint) {
			if (scene.waterTint === 'gradient') {
				// Translucent so the desktop wallpaper still shows through the tank.
				const g = bufferCtx.createLinearGradient(0, 0, 0, bh);
				g.addColorStop(0, 'rgba(96, 186, 228, 0.28)');
				g.addColorStop(1, 'rgba(18, 68, 108, 0.52)');
				bufferCtx.fillStyle = g;
			} else {
				bufferCtx.fillStyle = scene.waterTint;
			}
			bufferCtx.fillRect(0, 0, bw, bh);
			drawCaustics(bufferCtx, bw, bh, clock);
		}

		// Draw into buffer using scene coordinates: everything is scaled down by
		// 1/pixelScale, which is what produces the chunky upscale later.
		const inv = 1 / scene.pixelScale;
		bufferCtx.setTransform(inv, 0, 0, inv, 0, 0);
		bufferCtx.imageSmoothingEnabled = false;

		// Plants first (background), anchored to the floor.
		for (const p of plants) {
			if (!p.sprite.img.complete) continue;
			const w = p.size * p.sprite.aspect;
			const angle = (oscillate(clock, p.swayDeg, p.swayPeriod, p.phase) * Math.PI) / 180;
			bufferCtx.save();
			bufferCtx.translate(p.x, sceneH);
			bufferCtx.rotate(angle);
			bufferCtx.drawImage(p.sprite.img, -w / 2, -p.size, w, p.size);
			bufferCtx.restore();
		}

		// Fish, sorted so deeper fish render behind shallower ones.
		for (const f of [...fish].sort((a, b) => a.depth - b.depth)) {
			if (!f.sprite.img.complete) continue;
			const w = f.size * f.sprite.aspect;
			const y = depthToY(f.depth, sceneH, MARGIN + f.size / 2) + oscillate(clock, f.bobAmp, f.bobPeriod, f.phase);
			bufferCtx.save();
			bufferCtx.translate(f.x, y);
			if (f.flip && f.dir === -1) bufferCtx.scale(-1, 1);
			bufferCtx.drawImage(f.sprite.img, -w / 2, -f.size / 2, w, f.size);
			bufferCtx.restore();
		}

		if (scene.posterizeLevels > 0) posterize(bufferCtx, bw, bh, scene.posterizeLevels);

		// Upscale the small buffer onto the visible canvas — nearest-neighbour.
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, sceneW, sceneH);
		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(buffer, 0, 0, bw, bh, 0, 0, sceneW, sceneH);
	}

	function frame(now: number) {
		const dt = lastTime ? Math.min(MAX_DT, (now - lastTime) / 1000) : 0;
		lastTime = now;
		step(dt);
		draw();
		raf = requestAnimationFrame(frame);
	}

	function resize(width: number, height: number) {
		const canvas = getCanvas();
		if (!canvas) return;
		sceneW = Math.max(1, Math.round(width));
		sceneH = Math.max(1, Math.round(height));
		canvas.width = sceneW;
		canvas.height = sceneH;
		ctx = canvas.getContext('2d');

		bw = Math.max(1, Math.round(sceneW / scene.pixelScale));
		bh = Math.max(1, Math.round(sceneH / scene.pixelScale));
		buffer = document.createElement('canvas');
		buffer.width = bw;
		buffer.height = bh;
		bufferCtx = buffer.getContext('2d');

		if (!built) build();
		placeEntities();
		draw(); // repaint immediately so a resize (or reduced motion) shows a frame
	}

	function start() {
		if (raf || reduceMotion) return; // reduced motion: static frame only
		lastTime = 0;
		raf = requestAnimationFrame(frame);
	}

	function stop() {
		if (raf) cancelAnimationFrame(raf);
		raf = 0;
	}

	return { start, stop, resize };
}

/** Slow, wavy bands of light drifting across the surface — a subtle water feel. */
function drawCaustics(c: CanvasRenderingContext2D, w: number, h: number, time: number) {
	c.save();
	c.globalCompositeOperation = 'screen';
	c.strokeStyle = 'rgba(255, 255, 255, 0.07)';
	c.lineWidth = Math.max(1, h * 0.03);
	for (let i = 0; i < 3; i++) {
		const yBase = h * (0.12 + i * 0.14);
		c.beginPath();
		for (let x = 0; x <= w; x += 2) {
			const y = yBase + Math.sin((x / w) * Math.PI * 4 + time * 0.5 + i * 1.7) * h * 0.02;
			if (x === 0) c.moveTo(x, y);
			else c.lineTo(x, y);
		}
		c.stroke();
	}
	c.restore();
}

/** Snap each color channel to N levels for a compressed, banded look. */
function posterize(c: CanvasRenderingContext2D, w: number, h: number, levels: number) {
	c.setTransform(1, 0, 0, 1, 0, 0);
	const image = c.getImageData(0, 0, w, h);
	const data = image.data;
	const step = 255 / (levels - 1);
	for (let i = 0; i < data.length; i += 4) {
		data[i] = Math.round(data[i] / step) * step;
		data[i + 1] = Math.round(data[i + 1] / step) * step;
		data[i + 2] = Math.round(data[i + 2] / step) * step;
	}
	c.putImageData(image, 0, 0);
}
