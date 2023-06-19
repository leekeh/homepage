export type PageMetaData = {
	glossary: Record<string, string>;
	isOptional?: boolean;
	exercises?: Exercise[];
};

type Exercise = {
	id: string;
	title: string;
	description: string;
	type: 'multiple-choice' | 'assignment';
};

export type Progress = Record<
	string,
	{
		id: string;
		answer?: string;
		completed: boolean;
	}
>;
