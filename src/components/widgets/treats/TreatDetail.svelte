<script lang="ts">
	import Button from '@components/OS/Button.svelte';
	import ModelViewer from './ModelViewer.svelte';
	import { locations, formatDate, formatPrice, getTreatById } from './data';
	import Link from '@components/OS/Link.svelte';

	interface Props {
		/** The treat's imgId, taken from the /treats/[id] route param. */
		id?: string;
	}

	let { id = '' }: Props = $props();

	const treat = $derived(getTreatById(id));
</script>

{#if treat}
	{@const location = locations[treat.locationId]}
	<article class="detail">
		<div class="inner">
			<div class="model">
				<ModelViewer imgId={treat.imgId} title={treat.title} />
			</div>

			<div class="info">
				<p class="review">{treat.review}</p>

				<div class="meta">
					Snacked at
					<!-- External links to the venue's site + Google Maps. -->
					<!-- eslint-disable svelte/no-navigation-without-resolve -->
					<Link href={location.url} target="_blank" rel="noopener">{location.name}</Link>

					<!-- eslint-enable svelte/no-navigation-without-resolve -->
					on
					<time datetime={treat.date}>{formatDate(treat.date)}</time>
					{#if treat.price}
						for
						<span class="price">{formatPrice(treat.price)}</span>
					{/if}.
				</div>
			</div>
		</div>
	</article>
{:else}
	<div class="detail not-found">
		<Button href="/treats">← Back to all treats</Button>
		<p>That sweet treat could not be found!</p>
	</div>
{/if}

<style>
	.detail {
		padding: var(--space-4);
	}

	.not-found {
		font-family: var(--font-sans);
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		align-items: flex-start;
	}

	.inner {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-5);
		align-items: start;
		margin-top: var(--space-4);
	}

	.meta {
		margin-top: 2lh;
	}

	.model {
		max-width: 360px;
	}

	.info {
		font-family: var(--font-sans);
	}

	.review {
		text-wrap: pretty;
	}

	@media (max-width: 600px) {
		.inner {
			grid-template-columns: 1fr;
		}
		.model {
			max-width: 100%;
			justify-self: center;
		}
	}
</style>
