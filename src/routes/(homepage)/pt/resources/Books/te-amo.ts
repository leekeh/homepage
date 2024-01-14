import type { Course } from '../types';

export const title = 'Adivinha Quanto Eu Te Amo';

const course: Course = {
	title,
	description: 'Guess how much I love you',
	method: { title: 'Adivinha Quanto Eu Te Amo', ISBN: '9788546901975' },
	vocab: [
		{
			title: 'Common words',
			items: [
				{ word: 'sim', translation: 'yes', pronunciation: 'ˈsĩ' },
				{ word: 'não', translation: 'no', pronunciation: 'ˈnɐ̃w̃' }
			]
		}
	],
	sentences: [],
	grammar: []
};

export default course;
