<script>
	import Content from '@components/content.svelte';
	import notfoundimg from './404.png';
	import Button from '@components/OS/Button.svelte';
	import { useWindowManager } from '@components/OS/shared/windowManager.svelte';

	const wm = $derived(useWindowManager());
</script>

<Content>
	<p>The blog post could not be found!</p>

	<Button onclick={() => wm.closeActiveWindow()} href="/blog">Go back to all posts</Button>

	<div class="squiggle-border" style="margin-top: var(--space-4); width: fit-content;">
		<img src={notfoundimg} alt="" />
	</div>
</Content>
