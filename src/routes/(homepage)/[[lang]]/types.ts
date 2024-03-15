type baseProps = {
	creationDate: string;
	editDate: string;
	imageSrc: string;
};

export type PostMetaData = baseProps & {
	nl: langSensitiveMetadata;
	en: langSensitiveMetadata;
};

export type Post = baseProps & langSensitiveMetadata;

type langSensitiveMetadata = {
	title: string;
	summary: string;
};
