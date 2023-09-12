export type PageMetaData = {
	glossary: Record<string, { description: string; summary: string }>;
	isOptional?: boolean;
	exercises?: Record<string, Exercise>;
};

export type Exercise = {
	title: string;
	description?: string;
} & MultipleChoice;

type MultipleChoice = {
	type: 'multiple-choice';
	options: { value: string; label: string }[];
	solution: string;
};

export type Progress = Record<
	string,
	{
		exercises?: Record<string, { answer?: string; completed: boolean }>;
		read: boolean;
	}
>;
