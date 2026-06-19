export function hexToRgba(hex: string): [number, number, number, number] {
	return [
		parseInt(hex.slice(1, 3), 16),
		parseInt(hex.slice(3, 5), 16),
		parseInt(hex.slice(5, 7), 16),
		255
	];
}

export function rgbaToHex(r: number, g: number, b: number): string {
	return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function colorsMatch(a: number[], b: number[]): boolean {
	return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

export function pickColor(ctx: CanvasRenderingContext2D, x: number, y: number): string {
	const pixel = ctx.getImageData(x, y, 1, 1).data;
	return rgbaToHex(pixel[0], pixel[1], pixel[2]);
}
