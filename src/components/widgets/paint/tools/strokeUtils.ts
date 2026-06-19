import type { DrawPos } from './types';

export function drawStroke(
	ctx: CanvasRenderingContext2D,
	pos: DrawPos,
	strokeStyle: string,
	lineWidth: number,
	lineCap: CanvasLineCap,
	lineJoin: CanvasLineJoin
) {
	ctx.globalCompositeOperation = 'source-over';
	ctx.strokeStyle = strokeStyle;
	ctx.lineWidth = lineWidth;
	ctx.lineCap = lineCap;
	ctx.lineJoin = lineJoin;
	ctx.lineTo(pos.x, pos.y);
	ctx.stroke();
}
