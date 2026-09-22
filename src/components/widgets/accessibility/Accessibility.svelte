<script lang="ts">
	import Content from '@components/content.svelte';
	import { resolvePath } from '@utils/resolve';
</script>

<Content>
	<p>
		This website is a personal project for me to showcase my work and interests. I want this site to
		be usable by as many people as possible, regardless of ability or the technology they use to
		browse the web.
	</p>

	<h3>The standard</h3>
	<p>
		I am aiming to adhere to at least WCAG AA compliance, tracking the <a
			href="https://www.w3.org/WAI/standards-guidelines/wcag/
">current stable version (2.2)</a
		>.
	</p>

	<h3>What I am doing</h3>
	<p>
		Complex features on this site are authored using the <a href="https://www.w3.org/WAI/ARIA/apg/">
			ARIA Authoring Practices Guide (APG)</a
		>. I am educated and CPACC certified and this influences how I author content and features on
		this site. All content on this site is continuously monitored using a variety of automated
		accessibility testing tools. Manual testing using inspectors and screen readers is applied as
		needed.
	</p>

	<p>
		I'm tring to balance creativity with accessibility. While the core design meets accessibility
		guidelines, there are some animations that could be distracting or otherwise bothersome. I tried
		to mitigate this issue by providing controls to turn them off, and disabling them if reduced
		motion is on in the browser settings.
	</p>

	<p>
		I also educate professional peers on accessibility and frequently post about the topic. On this
		site, I author blog articles diving into various topics related to accessibility.
	</p>

	<h3>Known issues</h3>

	<p>
		Due to the nature of them, some widgets are not usable without a pointer device. Currently, that
		is the case for the paint widget, which requires interacting with the canvas. All other parts of
		the site should be fully functional using just keyboard navigation, and I'm working on keyboard
		shortcuts to make the experience even better.
	</p>

	<p>
		Content contained inside iframes such as embedded external websites are not under my control,
		and might have accessibility issues.
	</p>

	<h3>Found a problem?</h3>

	<p>
		If you run into an accessibility barrier anywhere on this site, please
		<a href={resolvePath('/contact')}>let me know</a>
		so I can fix it.
	</p>
</Content>
