<script lang="ts">
	import { Heading, Button } from '@components';
</script>

<form>
	<Heading as="h2">Test your knowledge</Heading>

	<slot />
	<Button style="align-self: start">Check answers</Button>
</form>

<style>
	form {
		outline: var(--border-width) solid var(--accent);
		border-radius: var(--border-radius);
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
