export type Section = {
	sectionName: string;
	pages: string[];
};

const pageMap: Section[] = [
	{
		sectionName: 'Introduction',
		pages: ['intro']
	},
	{
		sectionName: 'HTML',
		pages: ['html']
	},
	{
		sectionName: 'CSS',
		pages: ['intro', 'temp2']
	},
	{
		sectionName: 'JavaScript',
		pages: ['intro', 'temp2']
	},
	{
		sectionName: 'Other things',
		pages: ['intro', 'temp2']
	},
	{
		sectionName: 'Conclusion',
		pages: ['intro', 'temp2']
	}
];

export default pageMap;
