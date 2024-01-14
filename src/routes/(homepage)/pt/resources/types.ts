export type Course = {
	vocab: Group<VocabItem>[];
	sentences: Group<Sentence | Sentence[]>[];
	grammar: GrammarItem[];
	description: string;
	method: Method;
	title: string;
};

type Group<T> = { title: string; items: T[] };

type Method = {
	title: string;
	ISBN: string;
};

type VocabItem = { translation: string } & (({} & Case) | (WordBase & { gender?: 'masc' | 'fem' }));

type WordBase = {
	word: string;
	pronunciation?: string;
	note?: string;
};

export type Sentence = {
	text: string;
	translation: string;
};

type GrammarItem = Verb | CaseItem;

type Verb = { type: 'verb'; infinitive: string; translation: string; present: Conjugation };

type Conjugation = {
	single: { first: string; second: string; third: string };
	plural: { first: string; second: string; third: string };
};

type CaseItem = {
	type: 'case';
	topic: string;
	translation: string;
	cases: Case;
};

export type Case = {
	single: { masc: WordBase; fem: WordBase };
	plural?: { masc: WordBase; fem: WordBase };
};
