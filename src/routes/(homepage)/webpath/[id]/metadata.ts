export type PageMetaData = {
	id: string;
	title: string;
	glossary?: { term: string; explanation: string }[];
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
			{
				id: 'intro',
				title: 'Introduction',
				glossary: [
					{ term: 'DNS', explanation: 'todo' },
					{ term: 'IP ADRESS', explanation: 'todo' },
					{ term: 'DOM TREE', explanation: 'todo' },
					{ term: 'HTML', explanation: 'todo' },
					{ term: 'CSS', explanation: 'todo' },
					{ term: 'Javascript', explanation: 'todo' },
					{ term: 'SPA', explanation: 'Single-page application' },
					{ term: 'Vanilla Javascript', explanation: 'todo' }
				]
			},
			{ id: 'temp2', title: 'Introduction2' }
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
