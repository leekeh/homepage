<script lang="ts">
	import { Card, Heading, Table } from '@components';
	import { onMount } from 'svelte';

	let isMounted = false;
	onMount(() => {
		isMounted = true;
	});

	export let data;
	$: ({ resources } = data);
</script>

<Card as="section" style="width: max(300px, 80vw); padding: 0">
	<Heading as="h1" style="font-size: max(2rem, 5vw); padding-top: 1rem">
		Lieke's Portuguese practise corner
	</Heading>
	{#each Object.entries(resources) as [chapter, courses], i}
		<Heading as="h2" style="font-size: max(1.5rem, 2.5vw); padding-top: 1rem">
			{chapter}
		</Heading>
		<Table
			headers={['code', 'title']}
			rows={courses.map((course) => ({
				href: `pt/${chapter}/${course.code}`,
				values: [course.code, course.title]
			}))}
		/>
	{/each}
</Card>

<style>
</style>
