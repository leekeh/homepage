// Lighthouse CI config.
//
// The URL list is generated (dynamically, incl. every published blog post) by
// `scripts/qa-routes.mjs` into `lighthouse-urls.json` while the preview server
// is running — see the `lighthouse` job in .github/workflows/test.yml. If that
// file is missing (e.g. running locally without the generate step), we fall
// back to the core widget routes so the command still does something useful.
//
// Local run:
//   pnpm build
//   pnpm run preview --port 4173 &   # wait for it to be ready
//   node scripts/qa-routes.mjs http://localhost:4173 > lighthouse-urls.json
//   pnpm run test:lighthouse
//
// Score policy: performance is warn-only (CI runners have noisy CPU/network, so
// perf scores are the flaky ones); accessibility, best-practices and SEO block.

const BASE = process.env.LHCI_BASE_URL ?? 'http://localhost:4173';

let urls;
try {
	urls = require('./lighthouse-urls.json');
} catch {
	urls = ['/', '/blog', '/paint', '/contact', '/hire-me', '/treats'].map((route) =>
		new URL(route, BASE).toString()
	);
}

module.exports = {
	ci: {
		collect: {
			url: urls,
			// Median of 3 runs smooths out some of the per-run noise.
			numberOfRuns: 3,
			settings: {
				// model-viewer etc. pull remote assets; give pages room to settle.
				maxWaitForLoad: 45000
			}
		},
		assert: {
			assertions: {
				'categories:performance': ['warn', { minScore: 0.8 }],
				'categories:accessibility': ['error', { minScore: 0.95 }],
				'categories:best-practices': ['error', { minScore: 0.95 }],
				'categories:seo': ['error', { minScore: 0.95 }]
			}
		},
		upload: {
			// Keep reports as CI artifacts; no external LHCI server.
			target: 'filesystem',
			outputDir: './lighthouse-report'
		}
	}
};
