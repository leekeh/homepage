<script lang="ts">
	// Built dynamically so the literal substring "<script>" never appears in this
	// file's source: svelte-check's tsgo mode misparses it once a real <script>
	// block (this one) precedes it, misattributing bogus syntax errors to it.
	function scriptTag(attrs: string, body = '') {
		return `<${'script'}${attrs}>${body}</${'script'}>`;
	}
</script>

<p>This website is part of the following groups:</p>

{#snippet ring(data)}
	<figure>
		<img src={image.src} alt={image.caption} width={image.width} height={image.height} />
		<figcaption>{image.caption}</figcaption>
	</figure>
{/snippet}

<ul>
	<li>
		<div class="squiggle-border item" style="padding: var(--space-4);">
			<h4>a11y-webring.club</h4>
			<p>
				This site is a member of the <a rel="external" href="https://a11y-webring.club/"
					>a11y-webring.club</a
				>.
			</p>
			<nav aria-label="A11y webring club">
				<ul class="row">
					<li>
						<a rel="external" referrerpolicy="strict-origin" href="https://a11y-webring.club/prev"
							>Previous website</a
						>
					</li>
					<li>
						<a rel="external" referrerpolicy="strict-origin" href="https://a11y-webring.club/random"
							>Random website</a
						>
					</li>
					<li>
						<a rel="external" referrerpolicy="strict-origin" href="https://a11y-webring.club/next"
							>Next website</a
						>
					</li>
				</ul>
			</nav>
		</div>
	</li>

	<li>
		<div class="squiggle-border item" style="padding: var(--space-4);">
			<h4>Responsive Web Directory</h4>
			<p>
				This site is a member of the <a rel="external" href="https://kalechips.net/responsive/index"
					>Responsive Web Directory</a
				>.
			</p>
		</div>
	</li>

	<li>
		<div style="width: 135px;">
			<iframe
				style="border: none; width: 100%"
				title="WII Ring"
				src="https://wiiring.jeith.com/snippet?site=YOUR_SITE_HERE&variant=standard"
			></iframe>
		</div>
	</li>

	<li>
		<div class="item">
			<a href="https://gummyring.neocities.org"
				><img src="http://gummyring.neocities.org/gummyring-2color.png" alt="" /></a
			><br />
			<div class="row">
				<a href="https://gummyring.neocities.org/?action=previous"
					><img src="http://gummyring.neocities.org/back.png" alt="back" /></a
				>
				<a href="https://gummyring.neocities.org"
					><img src="http://gummyring.neocities.org/gummyring.png" alt="gummy ring" /></a
				>
				<a href="https://gummyring.neocities.org/?action=next"
					><img src="http://gummyring.neocities.org/next.png" alt="next" /></a
				>
			</div>
		</div>
	</li>
	<li>
		<!-- Isolate DSRing widget, don't run untrusted scripts -->
		<iframe
			title="DSring onion webring widget"
			sandbox="allow-scripts"
			loading="lazy"
			class="dsring-frame"
			style="border: none; width: 500px"
			srcdoc={`<!doctype html>
<html>
	<head>
		<meta charset="utf-8" />
		<link rel="stylesheet" href="https://dsring.neocities.org/dswidget/onionring.css" />
		<style>
			body {
				margin: 0;
				background: transparent;
			}
		</style>
	</head>
	<body>
		<div id="dsring" style="padding: 0; margin: 0;"></div>
		${scriptTag(' src="https://dsring.neocities.org/dswidget/onionring-variables.js"')}
		${scriptTag(' src="https://dsring.neocities.org/dswidget/onionring-widget.js"')}
	</body>
</html>`}
		>
		</iframe>
	</li>
</ul>

<style>
	ul {
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-content: start;
		gap: var(--space-6);
	}

	.row {
		display: flex;
		flex-direction: row;
		gap: var(--space-2);
	}

	.item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
