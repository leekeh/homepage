import temp1 from './temp1.svelte';
import temp2 from './temp2.svelte';

export default {
	temp1: { title: 'Temp 1', content: temp1 },
	temp2: { title: 'Temp 2', content: temp2 }
} as const;
