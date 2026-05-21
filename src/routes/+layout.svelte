<script lang="ts">
	import Shell from '../components/OS/Shell.svelte';
	import WindowProvider from '../components/OS/shared/WindowProvider.svelte';
	import GlobalStyles from '@components/layout/global-styles.svelte';
	import Seo from '@components/layout/seo.svelte';
	let { data } = $props();
</script>

<Seo {data} />
<GlobalStyles />

<WindowProvider>
	<Shell />
</WindowProvider>
