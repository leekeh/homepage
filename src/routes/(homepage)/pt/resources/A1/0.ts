import type { Course } from '../types';

export const title = 'Palavras e expressöes';

const course: Course = {
	title,
	description: 'Words and phrases',
	method: { title: 'Português XII 1', ISBN: '9789897523809' },
	vocab: [
		{
			title: 'Common words',
			items: [
				{ word: 'sim', translation: 'yes', pronunciation: 'ˈsĩ' },
				{ word: 'não', translation: 'no', pronunciation: 'ˈnɐ̃w̃' },
				{ word: 'obrigado', translation: 'thank you (masc)', pronunciation: 'ɔ.bɾiˈɡa.du' },
				{ word: 'obrigada', translation: 'thank you (fem)', pronunciation: 'o.bɾiˈɡa.dɐ' },
				{ word: 'de nada', translation: "you're welcome", pronunciation: 'dɨ ˈna.dɐ' },
				{ word: 'bom dia', translation: 'good morning', pronunciation: 'ˈbõ ˈdi.ɐ' },
				{ word: 'boa tarde', translation: 'good afternoon', pronunciation: 'ˈbo.ɐ ˈtaɾ.dɨ' },
				{ word: 'boa noite', translation: 'good evening', pronunciation: 'ˈbo.ɐ ˈnoj.t͡ʃi' },
				{ word: 'olá', translation: 'hello', pronunciation: 'ɔˈla' },
				{ word: 'até logo', translation: 'see you later', pronunciation: 'ɐˈtɛ ˈlɔ.ɡu' },
				{ word: 'adeus', translation: 'goodbye', pronunciation: 'ɐˈdewʃ' },
				{ word: 'desculpe', translation: 'excuse me', pronunciation: 'dɨʃˈkul.pɨ' },
				{ word: 'faz favor', translation: 'please', pronunciation: 'ˈfaʃ fɐˈvoɾ' },
				{ word: 'por favor', translation: 'please', pronunciation: 'puɾ fɐˈvoɾ' },
				{ word: 'puxe', translation: 'pull', pronunciation: 'ˈpu.ʃɨ' },
				{ word: 'empurre', translation: 'push', pronunciation: 'ẽ.ˈpu.ʁɨ' },
				{ word: 'fechado', translation: 'closed', pronunciation: 'fɨˈʃa.du' },
				{ word: 'aberto', translation: 'open', pronunciation: 'ɐˈbɛɾ.tu' },
				{ word: 'entrada', translation: 'entrance', pronunciation: 'ẽˈtɾa.dɐ' },
				{ word: 'saída', translation: 'exit', pronunciation: 'sɐˈi.dɐ' }
			]
		}
	],
	sentences: [
		{
			title: 'Common sentences',
			items: [
				{ text: 'Não falo português', translation: "I don't speak Portuguese" },
				{ text: 'Não compreendo', translation: "I don't understand" },
				{ text: 'Pode repetir?', translation: 'Can you repeat?' }
			]
		}
	],
	grammar: []
};

export default course;
