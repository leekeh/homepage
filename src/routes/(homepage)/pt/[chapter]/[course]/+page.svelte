<script lang="ts">
	import { Card, Heading, Table } from '@components';
	import { onMount } from 'svelte';
	import type { Course } from '../../resources/types';
	import WordCollapser from './WordCollapser.svelte';
	import SentenceCollapser from './SentenceCollapser.svelte';
	import Row from '@components/Table/Row.svelte';

	let isMounted = false;

	export let data: { resources: Course };
	$: ({
		resources: { title, description, vocab, sentences, grammar }
	} = data);

	onMount(() => {
		isMounted = true;
	});

	const tableStyle = 'width: 80%';
</script>

<Card as="section" style="width: max(300px, 80vw);">
	<Heading as="h1" style="font-size: max(2rem, 5vw); padding-top: 1rem">{title}</Heading>

	{#if description}
		<Heading as="h2" style="font-size: max(1.5rem, 2.5vw);">
			{description}
		</Heading>
	{/if}

	{#each grammar as grammarGroup, i}
		{#if grammarGroup.type === 'case'}
			<Heading as="h2" style="font-size: max(1.5rem, 2.5vw); padding-top: 1rem;">
				{grammarGroup.topic}
			</Heading>
			<p>{grammarGroup.translation}</p>
			<Table headers={['', 'Masculine', 'Feminine']} style={tableStyle}>
				{#if grammarGroup.cases.single}
					<Table.Row>
						<Table.Row.Cell as="th">Single</Table.Row.Cell>
						<Table.Row.Cell>{grammarGroup.cases.single.masc.word}</Table.Row.Cell>
						<Table.Row.Cell>{grammarGroup.cases.single.fem.word}</Table.Row.Cell>
					</Table.Row>
				{/if}
				{#if grammarGroup.cases.plural}
					<Table.Row>
						<Table.Row.Cell as="th">Plural</Table.Row.Cell>
						<Table.Row.Cell>{grammarGroup.cases.plural.masc.word}</Table.Row.Cell>
						<Table.Row.Cell>{grammarGroup.cases.plural.fem.word}</Table.Row.Cell>
					</Table.Row>
				{/if}
			</Table>
		{/if}

		{#if grammarGroup.type === 'verb'}
			<Heading as="h2" style="font-size: max(1.5rem, 2.5vw); padding-top: 1rem;">
				{grammarGroup.infinitive}
			</Heading>
			<p>{grammarGroup.translation}</p>
			{#if grammarGroup.present}
				<Table title="Present" style="width: 50%">
					<Table.Row children={['Eu', grammarGroup.present.single.first]} />
					<Table.Row children={['Tu', grammarGroup.present.single.second]} />
					<Table.Row children={['Ele/Ela', grammarGroup.present.single.third]} />
					<Table.Row children={['Nós', grammarGroup.present.plural.first]} />
					<Table.Row children={['Vós', grammarGroup.present.plural.second]} />
					<Table.Row children={['Eles/Elas', grammarGroup.present.plural.third]} />
				</Table>
			{/if}
		{/if}
	{/each}

	{#each vocab as vocabGroup, i}
		<Heading as="h2" style="font-size: max(1.5rem, 2.5vw); padding-top: 1rem;">
			{vocabGroup.title}
		</Heading>
		<Table headers={['word', 'translation']} style={tableStyle}>
			{#each vocabGroup.items as word}
				<Table.Row>
					{#if 'word' in word}
						<Table.Row.Cell>{word.word}</Table.Row.Cell>
					{:else}
						<Table.Row.Cell><WordCollapser {word} /></Table.Row.Cell>
					{/if}

					<Table.Row.Cell>{word.translation}</Table.Row.Cell>
				</Table.Row>
			{/each}
		</Table>
	{/each}

	{#each sentences as sentenceGroup, i}
		<Heading as="h2" style="font-size: max(1.5rem, 2.5vw); padding-top: 1rem;">
			{sentenceGroup.title}
		</Heading>
		<Table headers={['sentence', 'translation']} style={tableStyle}>
			{#each sentenceGroup.items as sentence}
				<Table.Row>
					{#if Array.isArray(sentence)}
						<Table.Row.Cell><SentenceCollapser sentences={sentence} /></Table.Row.Cell>
						<Table.Row.Cell>{sentence[0].translation}</Table.Row.Cell>
					{:else}
						<Table.Row.Cell>{sentence.text}</Table.Row.Cell>
						<Table.Row.Cell>{sentence.translation}</Table.Row.Cell>
					{/if}
				</Table.Row>
			{/each}
		</Table>
	{/each}
</Card>
