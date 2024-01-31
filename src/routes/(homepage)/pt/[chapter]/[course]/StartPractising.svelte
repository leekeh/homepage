<script lang="ts">
	import { Card, Heading, Button, RadioGroup } from '@components';

	let srcLang: 'pt' | 'en' = 'pt';
	export let onStartPractise: (scrLang: 'pt' | 'en') => void;
</script>

<Card style="background: var(--accent-subtle); width: 80%;">
	<Heading as="h2">Start practising</Heading>
	<RadioGroup
		label="Question direction"
		options={[
			{ label: 'Portuguese to English', value: 'pt' },
			{ label: 'English to Portuguese', value: 'en' }
		]}
		bind:value={srcLang}
	/>

	<Button on:click={() => onStartPractise(srcLang)}>Start practising</Button>
</Card>
