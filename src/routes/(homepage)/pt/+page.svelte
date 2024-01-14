<script lang="ts">
	import { Card, Heading, Table, Link } from '@components';
	import { onMount } from 'svelte';

	let isMounted = false;
	onMount(() => {
		isMounted = true;
	});

	export let data;
	$: ({ resources } = data);
</script>

<Card as="section" style="width: max(300px, 80vw)">
	<Heading as="h1" style="font-size: max(2rem, 5vw); padding-top: 1rem">
		Lieke's Portuguese practise corner
	</Heading>

	<p style="font-size: 1.3rem; text-wrap: pretty">
		Welcome to my Portuguese practise corner! I put all the data from the courses I'm doing into a
		system that generates elevated flashcards. Maybe I will create a platform for others to add
		their own courses in the future, but right now <Link
			href="https://github.com/leekeh?tab=repositories">I am swamped with projects</Link
		>. Still, if you are studying <strong>European</strong> Portuguese, maybe this is of use to you.
	</p>

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
