<script lang="ts">
	import { RadioGroup } from '@components';
	import type { Exercise } from '../types';
	import { onMount } from 'svelte';
	// todo add structured data https://developers.google.com/search/docs/appearance/structured-data/practice-problems
	export let type: Exercise['type'];
	export let id: string;
	export let title: Exercise['title'];
	export let options: Exercise['options'];
	export let solution: Exercise['solution'];
	import { progress } from '../stores';
	import { page } from '$app/stores';
	import { Check, Alert } from '@icons';

	$: pageId = $page.route.id?.slice($page.route.id.lastIndexOf('/') + 1) ?? '';

	let state: string = 'default';

	$: exerciseProgress = $progress[pageId].exercises[id];

	const markComplete = () => {
		progress.update((prevState) => {
			return {
				...prevState,
				[pageId]: {
					...prevState[pageId],
					exercises: {
						...prevState[pageId].exercises,
						[id]: {
							answer: exerciseProgress.answer,
							completed: true
						}
					}
				}
			};
		});
	};

	const markIncomplete = () => {
		progress.update((prevState) => {
			return {
				...prevState,
				[pageId]: {
					...prevState[pageId],
					exercises: {
						...prevState[pageId].exercises,
						[id]: {
							answer: exerciseProgress.answer,
							completed: false
						}
					}
				}
			};
		});
	};

	const validateAnswer = () => {
		if (type === 'multiple-choice') {
			if (exerciseProgress.answer === solution) {
				markComplete();
				state = 'correct';
			} else {
				markIncomplete();
				state = 'false';
			}
		}
	};

	onMount(() => {
		if (ref.parentElement?.nodeName === 'FORM') {
			ref.parentElement?.addEventListener('submit', validateAnswer);
		}
	});

	let ref: HTMLDivElement;
</script>

<div bind:this={ref} class={state}>
	{#if type === 'multiple-choice'}
		<RadioGroup label={title} {options} bind:value={exerciseProgress.answer} />
		<script>
		</script>
	{/if}

	{#if state === 'correct'}
		<p><Check />Your answer was correct!</p>
	{:else if state === 'false'}
		<p><Alert />Your answer was wrong. Try again!</p>
	{/if}
</div>

<style>
	p {
		display: flex;
		gap: 0.5rem;
	}

	div {
		padding: 1rem;
	}

	.correct {
		border: var(--accent-subtle) solid 0.4rem;
	}

	.false {
		border: #cc003336 solid 0.4rem;
	}

	.default {
		border: #b3b3b336 solid 0.4rem;
	}
</style>
