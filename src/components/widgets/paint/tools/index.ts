import type { Component } from 'svelte';
import type { ToolId, ToolBehavior } from './types';

export type { ToolId, ToolBehavior, DrawPos } from './types';

export { createSelectTool } from './select.svelte';
export { createTextTool } from './text.svelte';

export const SIZE_OPTIONS = ['1', '3', '5', '8'] as const;
export type BrushSize = (typeof SIZE_OPTIONS)[number];

export interface Tool {
	id: ToolId;
	label: string;
	icon: Component;
	behavior?: ToolBehavior;
}

import * as pencil from './pencil';
import * as brush from './brush';
import * as spray from './spray';
import * as eraser from './eraser';
import * as fill from './fill';
import * as line from './line';
import * as rect from './rect';
import * as ellipse from './ellipse';
import * as select from './select.svelte';
import * as text from './text.svelte';

export const TOOLS: Tool[] = [
	pencil,
	brush,
	spray,
	eraser,
	fill,
	line,
	rect,
	ellipse,
	select,
	text
];
