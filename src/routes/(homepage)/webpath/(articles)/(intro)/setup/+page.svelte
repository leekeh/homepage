<script lang="ts" context="module">
	import type { PageMetaData } from '../../../types';

	export const metadata: PageMetaData = {
		title: 'Setting up our environment',
		glossary: { IDE: 'This description is coming soon to a place near you.', openSource: 'TODO' }
	};
</script>

<script lang="ts">
	import { platform } from '@stores';
	import { hasProgrammed } from '../../../stores';
	import Details from '@components/Details.svelte';

	const getSamplePlatform = (platform: string) => {
		switch (platform) {
			case 'Mac':
			case 'iPad':
				return 'TextEdit';
			case 'Windows':
				return 'NotePad';
			case 'Linux':
				return 'Vi';
			default:
				return '';
		}
	};
</script>

{#if $hasProgrammed === 'true'}
	<p>
		We will be using Visual Studio Code as the recommended IDE. It is an open-source editor that is
		available for Mac, Windows and Linux. Of course, feel free to use a different editor if you
		prefer.
	</p>
{:else}
	<p>
		Let's prepare our workspace. You don't need much to make a website. In fact, you can make a page
		using just a plain text editor{getSamplePlatform($platform)
			? `such as ${getSamplePlatform($platform)}`
			: ''}. However, as our projects grow more complex, it would be nice to have a tool that is
		better tailored to our needs. This is where we use an <Details
			description={metadata.glossary.ide}
			summary="IDE"
		/>.
	</p>
	<p>
		There are many different IDE's that can be used to develop websites. For following along the
		exercises in this program, Visual Studio Code will be the recommended program. It is a free, <Details
			description={metadata.glossary.openSource}
			summary="open-source"
		/> program developed by Microsoft. You can download it <a href="tdo">here</a> and is available for
		Mac, Windows and Linux.
	</p>
{/if}
