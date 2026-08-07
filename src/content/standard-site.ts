import records from './blog/standard-site-records.json';

// The publish script (scripts/publish-standard-site.mjs) writes standard.site
// state here: `_publication` holds the AT-URI of this site's
// `site.standard.publication` record, and every other key maps a post slug to
// its `site.standard.document` AT-URI. Nothing in here is hand-edited — it is
// regenerated whenever records are published to the PDS.
type StandardSiteRecords = {
	_publication?: { uri: string };
	[slug: string]: { uri: string } | undefined;
};

const store = records as StandardSiteRecords;

// AT-URI of the publication record, also mirrored into
// static/.well-known/site.standard.publication by the publish script.
export const STANDARD_SITE_PUBLICATION = store._publication?.uri ?? '';

export const hasStandardSitePublication = STANDARD_SITE_PUBLICATION.startsWith('at://');

// AT-URI of a single post's document record, or undefined if unpublished.
export function standardSiteDocumentUri(slug: string): string | undefined {
	return store[slug]?.uri;
}
