export interface FolderMeta {
	title: string;
	description?: string;
}

export interface PhotoInput {
	imgId: string;
	alt: string;
	caption?: string;
	credit?: string;
	/** Extension of the full-size image. Defaults to 'webp'. */
	ext?: 'webp' | 'gif' | 'png' | 'jpg' | 'jpeg';
}

export type Photo = PhotoInput & { folderId: string };
