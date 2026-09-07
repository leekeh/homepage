// Retro aquarium — single source of config.
//
// To add a fish or plant: drop a PNG in ./assets/fish or ./assets/plants,
// import it below, and add an entry to the `fish` / `plants` array.
// Sprites are imported (not string paths) so Vite hashes + bundles them.
//
// Sprites should face RIGHT with a transparent background. The engine mirrors
// them automatically when a fish swims left (unless `flip: false`).

import orange from './assets/fish/orange.png';
import blue from './assets/fish/blue.png';
import yellow from './assets/fish/yellow.png';
import seaweed from './assets/plants/seaweed.png';
import kelp from './assets/plants/kelp.png';

export interface FishConfig {
	/** Imported PNG url. */
	src: string;
	/** Sprite height in scene pixels (width scales to keep aspect ratio). */
	size: number;
	/** Horizontal drift speed in scene px/sec. */
	speed: number;
	/** How many of this fish to spawn. */
	count: number;
	/** Vertical band the fish swims in: 0 = top, 1 = bottom. Default 0.1–0.9. */
	depthMin?: number;
	depthMax?: number;
	/** Vertical bob amplitude in scene px. Default 6. */
	bob?: number;
	/** Mirror the sprite to face travel direction. Default true. */
	flip?: boolean;
}

export interface PlantConfig {
	/** Imported PNG url. */
	src: string;
	/** Sprite height in scene pixels. */
	size: number;
	/** How many to scatter along the floor. */
	count: number;
	/** Sway amplitude in degrees. Default 6. */
	sway?: number;
}

export const fish: FishConfig[] = [
	{ src: orange, size: 46, speed: 26, count: 3, depthMin: 0.15, depthMax: 0.7, bob: 7 },
	{ src: blue, size: 34, speed: 40, count: 4, depthMin: 0.1, depthMax: 0.55, bob: 5 },
	{ src: yellow, size: 28, speed: 18, count: 3, depthMin: 0.45, depthMax: 0.85, bob: 9 }
];

export const plants: PlantConfig[] = [
	{ src: seaweed, size: 96, count: 4, sway: 7 },
	{ src: kelp, size: 128, count: 3, sway: 5 }
];

export const scene = {
	/**
	 * Downscale factor for the internal render buffer. The whole scene is drawn
	 * at 1/pixelScale resolution then upscaled with nearest-neighbour, giving the
	 * chunky "compressed" retro look regardless of source image quality.
	 * Higher = chunkier.
	 */
	pixelScale: 2,
	/**
	 * Color quantization for extra JPEG-ish crunch. 0 = off. A value like 6
	 * snaps each channel to 6 levels. Costs a per-frame ImageData pass.
	 */
	posterizeLevels: 0,
	/**
	 * Water fill. `null` = fully transparent (fish overlay the desktop wallpaper).
	 * 'gradient' = a translucent blue tint + animated caustic shimmer that still
	 * lets the wallpaper show through. Or pass any CSS color (use rgba for
	 * see-through).
	 */
	waterTint: 'gradient' as string | null
};
