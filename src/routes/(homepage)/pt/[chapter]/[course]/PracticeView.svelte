<script lang="ts">
	import { IconButton } from '@components';
	import { Cross } from '@icons';
	import { shuffle } from '@util';

	export let data: import('../../resources/types').Course;
	export let onStop: () => void;
	export let srcLang: 'pt' | 'en';

	const exercises = shuffle([
		...data.vocab
			?.map((item) => item.items?.map((item) => ({ questionType: 'vocab', ...item })) ?? [])
			.flat(),
		...data.sentences
			?.map((item) => item.items?.map((item) => ({ questionType: 'sentence', ...item })) ?? [])
			.flat(),
		...data.grammar?.map((item) => ({ questionType: 'grammar', ...item }) ?? []).flat()
	]);

	function getQuestion() {
		const item = exercises[0];
		switch (item.questionType) {
			case 'vocab':
				if (srcLang === 'pt') {
					return {
						question: `What does <b>${item.word ?? item.single.masc}</b> mean?`,
						answers: [item.translation]
					};
				} else {
					return {
						question: `Translate the following word to portuguese: ${item.translation}`,
						answers: [
							item.word ?? (item.single.masc, item.single.fem, item.plural?.masc, item.plural?.fem)
						]
					};
				}
			case 'sentence':
				return {
					question: 'aa',
					answer: []
				};
			case 'grammar':
				return {
					question: 'bbbb',
					answer: []
				};
		}
	}

	let question = getQuestion();
</script>

<IconButton alt="Stop practising" style="position: absolute; right: 1rem" on:click={onStop}>
	<Cross />
</IconButton>
{question.question}

{#each question.answers as answer}
	{answer}
{/each}
