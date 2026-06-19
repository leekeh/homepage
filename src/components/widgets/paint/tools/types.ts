export type DrawPos = { x: number; y: number };

export type DrawingContext = {
	ctx: CanvasRenderingContext2D;
	pos: DrawPos;
	primaryColor: string;
	brushSize: number;
	startPos: DrawPos;
	shiftKey: boolean;
	snapshot: ImageData | null;
	persist: () => void;
};

export type ToolId =
	| 'pencil'
	| 'brush'
	| 'spray'
	| 'eraser'
	| 'fill'
	| 'line'
	| 'rect'
	| 'ellipse'
	| 'select'
	| 'text';

export type ToolBehavior = {
	/** If true, onPointerDown fires immediately without entering drawing state. */
	instant?: boolean;
	/** If true, a full canvas snapshot is taken before drawing starts. */
	requiresSnapshot?: boolean;
	/** If true, ctx.beginPath() + moveTo are called before onPointerDown. */
	startsPath?: boolean;
	/** If true, canvas is persisted after pointerup. */
	persistOnPointerUp?: boolean;
	onPointerDown?: (context: DrawingContext) => void;
	onPointerMove?: (context: DrawingContext) => void;
	onPointerUp?: (context: DrawingContext) => void;
};
