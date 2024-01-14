import { default as TableComponent } from './Table.svelte';
import { default as RowComponent } from './Row.svelte';
import Cell from './Cell.svelte';

const Row = Object.assign(RowComponent, { Cell });
export const Table = Object.assign(TableComponent, { Row });
