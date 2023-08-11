<script lang="ts" context="module">
	import type { PageMetaData } from '../../../types';
	import glossary from './glossary.json';

	export const metadata: PageMetaData = {
		glossary
	};
	import { platform } from '@stores';
	import { hasProgrammed } from '../../../stores';
	import { Details, List, Link, Image } from '@components';

	import newFile from './newFile.png';
	import extensions from './extensions.png';
	import { Code } from '@components';

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
			? ` such as ${getSamplePlatform($platform)}`
			: ''}. However, as our projects grow more complex, it would be nice to have a tool that is
		better tailored to our needs. This is where we use an <Details {...glossary.ide} />.
	</p>
	<p>
		There are many different IDE's that can be used to develop websites. Visual Studio Code is one
		of them, and the one that will be used in this course. It is a free, <Details
			{...glossary.openSource}
		/> program developed by Microsoft. It is available for Mac, Windows and Linux. Of course, feel free
		to use your own preferred IDE if you would like to do so.
	</p>
{/if}

<p>If you are following along with Visual Studio Code, let's try a quick setup.</p>

<List type="ordered">
	<li>
		Download the program from <Link href="https://code.visualstudio.com/">
			code.visualstudio.com
		</Link> and follow the steps to install it on your device.
	</li>
	<li>Create a new folder on your device.</li>
	<li>Start up Visual Studio Code and open your newly created folder</li>
	<li>
		Create a new file by pressing the document icon <img
			src={newFile}
			alt=""
			width="24px"
			height="24px"
		/>
		and give it the name <Code type="inline" content="index.html" lang="txt" />.
	</li>
	<li>
		Copy and paste the following code on the inside of the file:
		<br /><br />
		<Code
			lang="html"
			content={`
<!DOCTYPE html>
<html lang="en-US">
	<body>
		Hello world!
	</body>
</html>`}
		/>

		<br />
	</li>
	<li>Save the file.</li>
	<li>
		In the extensions <img src={extensions} alt="" width="30px" height="30px" /> menu of Visual Studio
		Code, look up the extension called 'Live Server' by Ritwick Dey. Install it.
	</li>
	<li>
		Back inside your index.html file, right click anywhere inside the code and press the option
		'open with Live Server'. Your browser should open with a page that containts the text 'Hello
		world!'.
	</li>
	<li>
		Try editing 'index.html'. If you change the file and then save it, the browser should show the
		updated version.
	</li>
</List>

<p>Congratulations! You are now officially developing a webpage.</p>
