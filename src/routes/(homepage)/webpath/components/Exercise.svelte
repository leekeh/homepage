<script lang="ts">
	// todo add structured data https://developers.google.com/search/docs/appearance/structured-data/practice-problems
	type types = 'multiple-choice' | 'completion';
	export let type: types;
	export let id: string;
	export let title: string;
	export let style: string = '';

	import { progress } from '../stores';
</script>

<h2>{title}</h2>

<style>
</style>
