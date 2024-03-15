<script lang="ts" context="module">
	import type { PostMetaData } from '../../../../../types';
	import { Heading } from '@components';
	import fries from './fries.jpg';
	export const metadata: PostMetaData = {
		creationDate: '2021-10-10',
		editDate: '2021-10-11',
		nl: {
			summary: 'loremiosumkdsnaflkjs;fdsjsfsadfs',
			title: 'Lieke en André zoeken de beste patat van Nederland'
		},
		en: {
			summary: 'loremiosumkdsnaflkjs;fdsjsfsadfs',
			title: 'Lieke & André rank the best Dutch fries'
		},
		imageSrc: fries
	};
</script>

<script lang="ts">
	export let data;
	const { lang } = data;

	const second = {
		nl: 'hallo',
		en: 'hello'
	};
</script>

<Heading as="h2">{second[lang]}</Heading>
<p>todo</p>

<Heading as="h2">Febo</Heading>

This will lead to the following conclusion: which one is best?
