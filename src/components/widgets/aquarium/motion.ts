// Pure motion helpers for the aquarium. No DOM/canvas access here so they can
// be unit-tested in isolation.

/**
 * Wrap a value into the half-open range [min, max). Used to loop a fish back to
 * the far edge once it swims fully off-screen.
 */
export function wrap(value: number, min: number, max: number): number {
	const span = max - min;
	if (span <= 0) return min;
	return min + (((value - min) % span) + span) % span;
}

/**
 * Map a normalized depth (0 = top, 1 = bottom) to a y pixel coordinate within a
 * scene of the given height, keeping `margin` px of padding at both edges.
 */
export function depthToY(depth: number, height: number, margin = 0): number {
	const clamped = Math.min(1, Math.max(0, depth));
	const usable = Math.max(0, height - margin * 2);
	return margin + clamped * usable;
}

/**
 * Sine oscillation used for fish bob and plant sway.
 * @param time seconds
 * @param amplitude peak offset
 * @param period seconds for a full cycle
 * @param phase constant offset in radians (varies per entity so they desync)
 */
export function oscillate(time: number, amplitude: number, period: number, phase = 0): number {
	if (period <= 0) return 0;
	return Math.sin((time / period) * Math.PI * 2 + phase) * amplitude;
}

/**
 * Deterministic pseudo-random in [0, 1) from an integer seed. Lets us scatter
 * entities without Math.random so a scene is reproducible for a given seed.
 */
export function seeded(seed: number): number {
	const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
	return x - Math.floor(x);
}
