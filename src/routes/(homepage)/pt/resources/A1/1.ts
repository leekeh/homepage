import type { Course } from '../types';

export const title = 'Olá! Como está?';

const course: Course = {
	title,
	description: '',
	method: { title: 'Português XII 1', ISBN: '9789897523809' },
	vocab: [
		{
			title: 'Os números',
			items: [
				{ word: 'zero', translation: 'zero', pronunciation: 'ˈzɛ.ɾu' },
				{
					translation: 'one',
					single: {
						masc: { word: 'um', pronunciation: 'ˈũ' },
						fem: { word: 'uma', pronunciation: 'ˈu.mɐ' }
					}
				},
				{
					translation: 'two',
					single: {
						masc: { word: 'dois', pronunciation: 'ˈdojʃ' },
						fem: { word: 'duas', pronunciation: 'ˈdu.ɐʃ' }
					}
				},
				{ word: 'três', translation: 'three', pronunciation: 'ˈtɾeʃ' },
				{ word: 'quatro', translation: 'four', pronunciation: 'ˈkwatɾu' },
				{ word: 'cinco', translation: 'five', pronunciation: 'ˈsĩ.ku' },
				{ word: 'seis', translation: 'six', pronunciation: 'ˈsɐjʃ' },
				{ word: 'sete', translation: 'seven', pronunciation: 'ˈsɛ.tɨ' },
				{ word: 'oito', translation: 'eight', pronunciation: 'ˈoj.tu' },
				{ word: 'nove', translation: 'nine', pronunciation: 'ˈnɔ.vɨ' },
				{ word: 'dez', translation: 'ten', pronunciation: 'ˈdɛʃ' },
				{ word: 'onze', translation: 'eleven', pronunciation: 'ˈõ.zɨ' },
				{ word: 'doze', translation: 'twelve', pronunciation: 'ˈdo.zɨ' },
				{ word: 'treze', translation: 'thirteen', pronunciation: 'ˈtɾe.zɨ' },
				{ word: 'catorze', translation: 'fourteen', pronunciation: 'kɐˈtoɾ.zɨ' },
				{ word: 'quinze', translation: 'fifteen', pronunciation: 'ˈkĩ.zɨ' },
				{ word: 'dezasseis', translation: 'sixteen', pronunciation: 'd͡zɐˈsɐjʃ' },
				{ word: 'dezassete', translation: 'seventeen', pronunciation: 'd͡zɐˈsɛt' },
				{ word: 'dezoito', translation: 'eighteen', pronunciation: 'ˈd͡zoj.tu' },
				{ word: 'dezanove', translation: 'nineteen', pronunciation: 'd͡zɐˈnɔv' },
				{ word: 'vinte', translation: 'twenty', pronunciation: 'ˈvĩ.tɨ' }
			]
		},
		{
			title: 'As profissões',
			items: [
				{ word: 'estudante', translation: 'student', pronunciation: '(i)ʃ.tuˈdɐ̃.tɨ' },
				{
					translation: 'painter',
					single: { fem: { word: 'pintora' }, masc: { word: 'pintor', pronunciation: 'pĩˈtoɾ' } }
				},
				{ word: 'polícia', translation: 'police officer', pronunciation: 'puˈli.sjɐ' },
				{
					translation: 'secretary',
					single: {
						fem: { word: 'secretária', pronunciation: 'sɨ.kɾɨˈta.ɾjɐ' },
						masc: {
							word: 'secretário',
							pronunciation: 'sɨ.kɾɨˈta.ɾju'
						}
					}
				},
				{
					translation: 'gardener',
					single: {
						masc: { word: 'jardeineiro', pronunciation: 'ʒɐɾ.diˈnɐj.ɾu' },
						fem: { word: 'jardineira', pronunciation: 'ʒɐɾ.diˈnɐj.ɾɐ' }
					}
				},
				{
					translation: 'doctor',
					single: {
						masc: { word: 'médico', pronunciation: 'ˈmɛ.di.ku' },
						fem: { word: 'médica' }
					}
				},
				{
					translation: 'cook',
					single: {
						masc: { word: 'cozinheiro', pronunciation: 'ku.ziˈɲɐj.ɾu' },
						fem: { word: 'cozinheira', pronunciation: 'ku.ziˈɲɐj.ɾɐ' }
					}
				},
				{ word: 'motorista', translation: 'driver', pronunciation: 'mu.tuˈɾiʃ.tɐ' },
				{
					translation: 'engineer',
					single: {
						masc: { word: 'engenheiro', pronunciation: 'ẽ.ʒɨˈɲɐj.ɾu' },
						fem: {
							word: 'engenheira',
							pronunciation: 'ẽ.ʒɨˈɲɐj.ɾɐ'
						}
					}
				},
				{
					translation: 'nurse',
					single: {
						masc: { word: 'enfermeiro', pronunciation: 'ẽ.fɨɾˈmɐj.ɾu' },
						fem: { word: 'enfermeira', pronunciation: 'enfeɾˈmejɾɐ' }
					}
				},
				{
					translation: 'carpenter',
					single: {
						masc: { word: 'carpinteiro', pronunciation: 'kaɾpinˈtejɾo̝' },
						fem: { word: 'carpinteira' }
					}
				},
				{
					translation: 'firefighter',
					single: {
						masc: { word: 'bombeiro', pronunciation: 'bõˈbɐj.ɾu' },
						fem: { word: 'bombeira' }
					}
				},
				{
					translation: 'waiter',
					single: {
						masc: { word: 'empregado de mesa', pronunciation: 'ẽ.pɾɨˈɡa.du dɨ ˈme.zɐ' },
						fem: { word: 'empregada de mesa', pronunciation: 'ẽ.pɾɨˈɡa.dɐ dɨ ˈme.zɐ' }
					}
				},
				{
					translation: 'farmer',
					single: {
						masc: { word: 'agricultor', pronunciation: 'ɐ.ɡɾi.kulˈtoɾ' },
						fem: { word: 'agricultora' }
					}
				},
				{ word: 'taxista', translation: 'taxi driver', pronunciation: 'taˈksiʃ.tɐ' }
			]
		},
		{
			title: 'Países e nacionalidades',
			items: [
				{
					word: 'Portugal',
					translation: 'Portugal',
					pronunciation: 'puɾ.tuˈɡal',
					note: 'Cannot be used with articles'
				},
				{
					translation: 'Portuguese',
					single: {
						masc: { word: 'português' },
						fem: { word: 'portuguesa' }
					},
					plural: {
						masc: { word: 'portugueses' },
						fem: { word: 'portuguesas' }
					}
				},
				{ word: 'Espanha', translation: 'Spain', pronunciation: '(i)ʃˈpɐ.ɲɐ', gender: 'fem' },
				{
					translation: 'Spanish',
					single: { masc: { word: 'espanhol' }, fem: { word: 'espanhola' } },
					plural: { masc: { word: 'espanhóis' }, fem: { word: 'espanholas' } }
				},
				{ word: 'França', translation: 'France', pronunciation: 'ˈfɾɐ̃.sɐ', gender: 'fem' },
				{
					translation: 'French',
					single: { masc: { word: 'francês' }, fem: { word: 'francesa' } },
					plural: { masc: { word: 'franceses' }, fem: { word: 'francesas' } }
				},
				{ word: 'Itália', translation: 'Italy', pronunciation: 'iˈta.ljɐ', gender: 'fem' },
				{
					translation: 'Italian',
					single: { masc: { word: 'italiano' }, fem: { word: 'italiana' } },
					plural: { masc: { word: 'italianos' }, fem: { word: 'italianas' } }
				},
				{ word: 'Alemanha', translation: 'Germany', pronunciation: 'ɐ.lɨˈmɐ.ɲɐ', gender: 'fem' },
				{
					translation: 'German',
					single: { masc: { word: 'alemão' }, fem: { word: 'alemã' } },
					plural: { masc: { word: 'alemães' }, fem: { word: 'alemãs' } }
				},
				{ word: 'Bélgica', translation: 'Belgium', pronunciation: 'ˈbɛl.ʒi.kɐ', gender: 'fem' },
				{
					translation: 'Belgian',
					single: { masc: { word: 'belga' }, fem: { word: 'belga' } },
					plural: { masc: { word: 'belgas' }, fem: { word: 'belgas' } }
				},
				{ word: 'Holanda', translation: 'Netherlands', pronunciation: 'ɔˈlɐ̃.dɐ', gender: 'fem' },
				{
					translation: 'Dutch',
					single: { masc: { word: 'holandês' }, fem: { word: 'holandesa' } },
					plural: { masc: { word: 'holandeses' }, fem: { word: 'holandesas' } }
				},
				{ word: 'Brasil', translation: 'Brazil', pronunciation: 'bɾɐˈzil', gender: 'masc' },
				{
					translation: 'Brazilian',
					single: { masc: { word: 'brasileiro' }, fem: { word: 'brasileira' } },
					plural: { masc: { word: 'brasileiros' }, fem: { word: 'brasileiras' } }
				},
				{ word: 'os Estados Unidos', translation: 'the United States' },
				{
					translation: 'American',
					single: { masc: { word: 'americano' }, fem: { word: 'americana' } },
					plural: { masc: { word: 'americanos' }, fem: { word: 'americanas' } }
				},
				{ word: 'Japão', translation: 'Japan', gender: 'masc', pronunciation: 'ʒɐˈpɐ̃w̃' },
				{
					translation: 'Japanese',
					single: { masc: { word: 'japonês' }, fem: { word: 'japonesa' } },
					plural: { masc: { word: 'japoneses' }, fem: { word: 'japonesas' } }
				},
				{
					word: 'Angola',
					translation: 'Angola',
					gender: 'fem',
					pronunciation: 'ɐ̃ˈɡɔ.lɐ',
					note: 'Cannot be used with articles'
				},
				{
					translation: 'Angolan',
					single: { masc: { word: 'angolano' }, fem: { word: 'angolana' } },
					plural: { masc: { word: 'angolanos' }, fem: { word: 'angolanas' } }
				},
				{
					word: 'Moçambique',
					translation: 'Mozambique',
					pronunciation: 'mu.sɐ̃ˈbi.kɨ',
					note: 'Cannot be used with articles'
				},
				{
					translation: 'Mozambican',
					single: { masc: { word: 'moçambicano' }, fem: { word: 'moçambicana' } },
					plural: { masc: { word: 'moçambicanos' }, fem: { word: 'moçambicanas' } }
				}
			]
		}
	],
	sentences: [
		{
			title: 'Introductions',
			items: [
				[
					{ text: 'Como se chama?', translation: 'What is your name?' },
					{ text: 'Como é que se chama?', translation: 'What is your name?' },
					{ text: 'Como é que você se chama?', translation: 'What is your name?' },
					{ text: 'Como é que ela se chama?', translation: 'What is her name?' },
					{ text: 'Como é que ele se chama?', translation: 'What is his name?' }
				],
				[
					{ text: 'Quem é ela?', translation: 'Who is she?' },
					{ text: 'Quem é ele?', translation: 'Who is he?' }
				],
				[
					{ text: 'De onde é?', translation: 'Where are you from?' },
					{ text: 'De onde és?', translation: 'Where are you from? (formal)' }
				],
				[
					{ text: 'Onde é que você mora?', translation: 'Where do you live? (formal)' },
					{ text: 'Onde é que ele mora?', translation: 'Where does he live?' },
					{ text: 'Onde é que ela mora?', translation: 'Where does she live?' }
				],
				{ text: 'És português?', translation: 'Are you Portuguese? (informal)' },

				[
					{ text: '[eu] Chamo-me {name}.', translation: 'My name is {name}.' },
					{ text: '[ela] Chama-se {name}.', translation: 'Her name is {name}.' }
				],
				[
					{ text: '[eu] Sou {name}.', translation: 'I am {name}.' },
					{ text: 'É {name}.', translation: 'He/she is {name}.' }
				],
				{ text: '[eu] Sou de {country}.', translation: 'I am from {country}.' },
				{ text: 'Olá', translation: 'Hello' },
				{ text: 'Bom dia', translation: 'Good morning' },
				{ text: 'Boa tarde', translation: 'Good afternoon' },
				[
					{ text: 'Como está?', translation: 'How are you?' },
					{ text: 'Como estás?', translation: 'How are you? (formal)' }
				],
				[
					{ text: 'Bem, obrigado', translation: 'Fine, thank you (masc)' },
					{ text: 'Bem, obrigada', translation: 'Fine, thank you (fem)' }
				],
				[
					{ text: 'Muito prazer!', translation: 'Nice to meet you!' },
					{ text: 'Muito gosto!', translation: 'Nice to meet you!' }
				]
			]
		},
		{
			title: 'Personal information',
			items: [
				[
					{ text: 'Esta é {name}.', translation: 'This is {name}. (fem)' },
					{ text: 'Este é {name}.', translation: 'This is {name}. (masc)' },
					{ text: 'Estes são {name}.', translation: 'These are {name}. (masc)' },
					{ text: 'Estas são {name}.', translation: 'These are {name}. (fem)' }
				],
				[
					{ text: 'É casado.', translation: 'He is married. (masc)' },
					{ text: 'É casada.', translation: 'She is married. (fem)' },
					{ text: 'Sou casado.', translation: 'I am married. (masc)' }
				],
				[
					{ text: 'Moro em {city}.', translation: 'I live in {city}.' },
					{ text: 'Moro na rua {street}.', translation: 'I live on {street}.' },
					{ text: 'Mora em {city}.', translation: 'He/she lives in {city}.' },
					{ text: 'Moram em {city}.', translation: 'They live in {city}.' }
				],
				[
					{
						text: 'Fala português e italiano.',
						translation: 'He/she speaks Portuguese and Italian.'
					},
					{ text: 'Falam português e italiano.', translation: 'They speak Portuguese and Italian.' }
				],
				{ text: 'na Alemanha', translation: 'in Germany' },
				[
					{ text: 'Sou solteiro.', translation: 'I am single (masc).' },
					{ text: 'Sou solteira.', translation: 'I am single (fem).' }
				],
				{ text: 'Tenho {age} anos.', translation: 'I am {age} years old.' },
				{
					text: 'Qual é a nacionalidade da Brigitte?',
					translation: "What is Brigitte's nationality?"
				}
			]
		}
	],
	grammar: [
		{
			type: 'verb',
			infinitive: 'ser',
			translation: 'to be',
			present: {
				single: { first: 'sou', second: 'és', third: 'é' },
				plural: { first: 'somos', second: 'sois', third: 'são' }
			}
		},
		{
			type: 'verb',
			infinitive: 'ter',
			translation: 'to have',
			present: {
				single: { first: 'tenho', second: 'tens', third: 'tem' },
				plural: { first: 'temos', second: 'tendes', third: 'têm' }
			}
		},
		{
			type: 'case',
			topic: 'Artigos definidos',
			translation: 'Definite articles',
			cases: {
				single: { masc: { word: 'o', pronunciation: 'u' }, fem: { word: 'a', pronunciation: 'ɐ' } },
				plural: {
					masc: { word: 'os', pronunciation: 'uʃ' },
					fem: { word: 'as', pronunciation: 'ɐʃ' }
				}
			}
		}
	]
};

export default course;
