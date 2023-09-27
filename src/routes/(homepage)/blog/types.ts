export type PostMetaData = {
	creationDate: string;
	editDate: string;
	imageSrc: string;
	nl: langSensitiveMetadata;
	en: langSensitiveMetadata;
};

type langSensitiveMetadata = {
	title: string;
	summary: string;
};
