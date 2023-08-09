export type Section = {
	sectionName: string;
	pages: { url: string; title: string }[];
};

const pageMap = [
	{
		sectionName: 'Introduction',
		pages: [
			{ url: 'intro', title: 'Journey of a webpage' },
			{ url: 'setup', title: 'Setting up our environment' }
		]
	},
	{
		sectionName: 'HTML',
		pages: [
			{ url: 'html', title: 'Introduction to HTML' },
			{ url: 'text', title: 'Text elements' },
			{ url: 'anchors', title: 'Link elements' },
			{ url: 'inspecting', title: 'Inspecting HTML' },
			{ url: 'forms', title: 'Forms, input elements & buttons' },
			{ url: 'img', title: 'Images' },
			{ url: 'tables', title: 'Tables' },
			{ url: 'semantics', title: 'Accessibility: semantic HTML' },
			{ url: 'meta', title: 'Metadata' },
			{ url: 'svg', title: 'Icons & other graphics' },
			{ url: 'overview', title: 'Overview & review' }
		]
	},
	{
		sectionName: 'CSS',
		pages: [
			{ url: 'css', title: 'Introduction to CSS' },
			{ url: 'boxes', title: 'CSS basics: styling a box' },
			{ url: 'position', title: 'Positioning elements' },
			{ url: 'fonts', title: 'Styling text' },
			{ url: 'flex', title: 'Flex layouts' },
			{ url: 'grid', title: 'Grid layouts' },
			{ url: 'responsive', title: 'Responsive styling & media queries' },
			{ url: 'cssvars', title: 'CSS variables' },
			{ url: 'darkmode', title: 'Creating a dark mode' },
			{ url: 'pseudo', title: 'Pseudo-selectors' },
			{ url: 'combinator', title: 'Targeting sibling or child elements' },
			{ url: 'css-frameworks', title: 'A note on frameworks' },
			{ url: 'animating', title: 'Animations & transitions' }
		]
	},
	{
		sectionName: 'JavaScript',
		pages: [
			{ url: 'javascript', title: 'Introduction to JavaScript' },
			{ url: 'js-basics', title: 'Basic syntax' },
			{ url: 'functions', title: 'Making functions' },
			{ url: 'arrays', title: 'Arrays' },
			{ url: 'objects', title: 'Objects & JSON' },
			{ url: 'interactions', title: 'Adding interaction to a page' },
			{ url: 'event-listeners', title: 'Listening to events' },
			{ url: 'api', title: 'Fetching data' },
			{ url: 'secrets', title: 'Hiding sensitive data' },
			{ url: 'debugging', title: 'Debugging' },
			{ url: 'pointers', title: 'Mutability & references' },
			{ url: 'typescript', title: 'TypeScript basics' },
			{ url: 'tests', title: 'Testing your code' }
		]
	},
	{
		sectionName: 'Other things',
		pages: [
			{ url: 'git', title: 'Git & version management' },
			{ url: 'ux', title: 'Designing user experiences' },
			{ url: 'compatability', title: 'Concerning compatability' },
			{ url: 'bundling', title: 'Bundlers' },
			{ url: 'hosting', title: 'Hosting your project' },
			{ url: 'frameworks', title: 'JavaScript frameworks' },
			{ url: 'ai', title: 'Using AI to your advantage' },
			{ url: 'seo', title: 'Search-engine optimisation' }
		]
	},
	{
		sectionName: 'Conclusion',
		pages: [
			{ url: 'project', title: 'Final project' },
			{ url: 'topics', title: 'Topics to explore deeper' },
			{ url: 'next-steps', title: 'Next steps' },
			{ url: 'end', title: 'The end' }
		]
	}
] as const;

export default pageMap;
