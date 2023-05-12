export type PageMetaData = {
	id: string;
	title: string;
	isOptional?: boolean;
};

export type Section = {
	sectionName: string;
	pages: PageMetaData[];
};

const metadata: Section[] = [
	{
		sectionName: 'Introduction',
		pages: [
			{ id: 'intro', title: 'Introduction' },
			{ id: 'test2', title: 'Introduction' }
		]
	},
	{
		sectionName: 'HTML',
		pages: [{ id: 'intro2', title: 'Introduction' }]
	},
	{
		sectionName: 'CSS',
		pages: [{ id: 'intro3', title: 'Introduction' }]
	},
	{
		sectionName: 'JavaScript',
		pages: [{ id: 'intro4', title: 'Introduction' }]
	},
	{
		sectionName: 'Other things',
		pages: [{ id: 'intro5', title: 'Introduction' }]
	},
	{
		sectionName: 'Conclusion',
		pages: [{ id: 'intro6', title: 'Introduction' }]
	}
];

export default metadata;
