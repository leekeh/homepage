<script lang="ts">
	import { useIsPrint } from './OS/shared/useIsPrint.svelte';

	type Props = {
		src: string;
		title: string;
		height?: string;
		caption?: string;
	};

	const titleId = $props.id();

	const isPrint = $derived(useIsPrint());

	let { src, title, height = '400px', caption }: Props = $props();
</script>

{#if isPrint}
	<p class="print-placeholder squiggle-border">
		On this section, there was an embedded iframe titled {title}. Iframes are not supported on
		prints, sadly. You can view the content online at
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external embed URL, not an app route -->
		<a href={src} target="_blank" rel="noopener noreferrer nofollow">{src}</a>.
	</p>
{:else}
	<figure class="tv squiggle-border" aria-labelledby={titleId}>
		<span class="antenna antenna-left" aria-hidden="true"></span>
		<span class="antenna antenna-right" aria-hidden="true"></span>
		<div class="tv-body">
			<div class="tv-screen">
				<iframe {src} {title} width="100%" style:height loading="lazy"></iframe>
				<div class="scanlines" aria-hidden="true"></div>
			</div>
			<div class="tv-controls" aria-hidden="true">
				<div class="knob"></div>
				<div class="knob"></div>
			</div>
		</div>
		<figcaption class="tv-caption" id={titleId}>
			{#if caption}
				<span class="caption-text">{caption}</span>
			{/if}
			<p class="credit">
				Source:
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external embed URL, not an app route -->
				<a href={src} target="_blank" rel="noopener noreferrer nofollow">{src}</a>
			</p>
		</figcaption>
	</figure>
{/if}

<style>
	.print-placeholder {
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		padding: var(--space-4) var(--space-5);
		margin-block: var(--space-7);
		background-color: var(--color-bg-highlight);
		border-radius: var(--radius-lg);
		text-align: center;
		break-inside: avoid;
	}

	.tv {
		position: relative;
		margin: var(--space-7) 0;
		background: var(--color-bg-highlight);
		border-radius: 18px 18px 14px 14px;
		padding: 16px 16px 0px 20px;
		display: flex;
		flex-direction: column;
		break-inside: avoid;
	}

	/* ── TV body ── */
	.tv-body {
		position: relative;
		display: flex;
		align-items: center;
		gap: 12px;
	}

	/* ── Antennas ── */
	.antenna {
		position: absolute;
		bottom: calc(100% - 4px);
		width: 3px;
		height: 42px;
		background-color: var(--color-accent);
		border: 1px solid var(--color-fg-primary);
		filter: var(--filter-squiggle);
		border-radius: 2px 2px 0 0;
	}

	.antenna-left {
		left: calc(50% - 14px);
		transform: rotate(-22deg);
		transform-origin: bottom center;
	}

	.antenna-right {
		left: calc(50% + 11px);
		transform: rotate(22deg);
		transform-origin: bottom center;
	}

	/* ── Screen ── */
	.tv-screen {
		flex: 1;
		position: relative;
		background: #0a0a0a;
		border-radius: 10px;
		overflow: hidden;
		border: 5px solid #3a3530;
		box-shadow:
			inset 0 0 24px rgba(0, 0, 0, 0.9),
			inset 0 0 6px rgba(0, 0, 0, 0.6);
	}

	.tv-screen iframe {
		display: block;
		width: 100%;
		border: none;
	}

	/* ── CRT scanline overlay ── */
	.scanlines {
		position: absolute;
		inset: 0;
		background: repeating-linear-gradient(
			to bottom,
			transparent 0px,
			transparent 3px,
			rgba(0, 0, 0, 0.07) 3px,
			rgba(0, 0, 0, 0.07) 4px
		);
		pointer-events: none;
		z-index: 1;
	}

	/* ── Side controls ── */
	.tv-controls {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 4px 2px;
		flex-shrink: 0;
	}

	.knob {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background-color: var(--color-bg-primary);
		border: var(--border-width) solid var(--color-fg-primary);
		filter: var(--filter-squiggle);
	}

	/* ── Caption ── */
	.tv-caption {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: var(--space-2) var(--space-3);
		padding-top: var(--space-3);
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
	}

	.caption-text {
		width: 100%;
		text-align: center;
		padding-top: var(--space-1);
	}

	.credit {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		width: 100%;
		text-align: center;
		padding-top: var(--space-1);
		font-style: italic;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		overflow: hidden;

		a {
			display: block;
			min-width: 0;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}
	}
</style>
