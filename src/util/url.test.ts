import { describe, expect, it } from 'vitest';
import { resolveCreditUrl } from './url';

describe('resolveCreditUrl', () => {
	it('returns the href for absolute URLs', () => {
		expect(resolveCreditUrl('https://www.flickr.com/photos/rampx/7676456146')).toBe(
			'https://www.flickr.com/photos/rampx/7676456146'
		);
		expect(resolveCreditUrl('http://www.flickr.com/photos/luckyflute/4138392433/')).toBe(
			'http://www.flickr.com/photos/luckyflute/4138392433/'
		);
	});

	it('adds https:// to protocol-less domains', () => {
		expect(resolveCreditUrl('itsbyrosie.tumblr.com')).toBe('https://itsbyrosie.tumblr.com/');
		expect(resolveCreditUrl('www.reddit.com/r/aww/comments/a89bnc/all_aboard_the_catbus')).toBe(
			'https://www.reddit.com/r/aww/comments/a89bnc/all_aboard_the_catbus'
		);
		expect(resolveCreditUrl('x.com/jowajohv/status/1438789096755933184')).toBe(
			'https://x.com/jowajohv/status/1438789096755933184'
		);
	});

	it('returns null for plain-text credits', () => {
		expect(resolveCreditUrl('Felicia Chiao')).toBeNull();
		expect(resolveCreditUrl('Tove Jansson')).toBeNull();
		expect(resolveCreditUrl('The Kingdom of Dreams and Madness')).toBeNull();
		expect(resolveCreditUrl('Quote fromt Barbara Ward.')).toBeNull();
		expect(resolveCreditUrl('Japan Post, 1987')).toBeNull();
		expect(resolveCreditUrl('"An Avenue at Nikko - Nikko Kaido" by Kawase Hasui')).toBeNull();
		expect(resolveCreditUrl('Nintendo — Animal Crossing: New Horizons')).toBeNull();
	});

	it('returns null for single-word strings that look like a host but have no TLD', () => {
		expect(resolveCreditUrl('Frozen')).toBeNull();
	});
});
