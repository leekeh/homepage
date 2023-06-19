export type Section = {
	sectionName: string;
	pages: { url: string; title: string }[];
};

const pageMap: Section[] = [
	{
		sectionName: 'Introduction',
		pages: [
			{ url: 'intro', title: 'Journey of a webpage' },
			{ url: 'setup', title: 'Setting up our environment' }
		]
	},
	{
		sectionName: 'HTML',
		pages: [{ url: 'html', title: 'Introduction to HTML' }]
	},
	{
		sectionName: 'CSS',
		pages: [
			{ url: 'intr3o', title: 'Introduction' },
			{ url: 'temp2', title: 'temp2' }
		]
	},
	{
		sectionName: 'JavaScript',
		pages: [
			{ url: 'int2ro', title: 'Introduction' },
			{ url: 'temp2', title: 'temp2' }
		]
	},
	{
		sectionName: 'Other things',
		pages: [
			{ url: 'intr2o', title: 'Introduction' },
			{ url: 'temp2', title: 'temp2' }
		]
	},
	{
		sectionName: 'Conclusion',
		pages: [
			{ url: 'intr1o', title: 'Introduction' },
			{ url: 'temp2', title: 'temp2' }
		]
	}
];

export default pageMap;
