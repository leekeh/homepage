<script lang="ts">
	import { Card, IconButton } from '@components';
	import type { Course } from '../../resources/types';
	import Overview from './Overview.svelte';
	export let data: { resources: Course };
	$: ({ resources } = data);
	import StartPractising from './StartPractising.svelte';
	import PracticeView from './PracticeView.svelte';

	let isPractising = false;
	let srcLang = 'pt';

	function startPractising(pickedLang: 'pt' | 'en') {
		srcLang = pickedLang;
		console.log(srcLang);
		isPractising = true;
	}
</script>

<Card as="section" style="width: max(300px, 80vw); position: relative">
	{#if isPractising}
		<PracticeView data={resources} onStop={() => (isPractising = false)} {srcLang} />
	{:else}
		<StartPractising onStartPractise={startPractising} />
		<Overview data={resources} />
	{/if}
</Card>
