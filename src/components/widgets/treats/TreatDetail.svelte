<script lang="ts">
	import Button from '@components/OS/Button.svelte';
	import ModelViewer from './ModelViewer.svelte';
	import { locations, formatDate, formatPrice, getTreatById } from './data';

	interface Props {
		/** The treat's imgId, taken from the /treats/[id] route param. */
		id?: string;
	}

	let { id = '' }: Props = $props();

	const treat = $derived(getTreatById(id));
	const location = $derived(treat ? locations[treat.locationId] : undefined);
</script>

{#if treat}
<article class="detail">
	<Button href="/treats" aria-label="Back to all treats">← Back</Button>

	<div class="inner">
		<div class="model">
			<ModelViewer imgId={treat.imgId} title={treat.title} />
		</div>

		<div class="info">
			<h2>{treat.title}</h2>

			<div class="meta">
				{#if location}
					<p class="location">
						<!-- External links to the venue's site + Google Maps. -->
						<!-- eslint-disable svelte/no-navigation-without-resolve -->
						<a href={location.url} target="_blank" rel="noopener">{location.name}</a>
						<a
							href={location.maps}
							target="_blank"
							rel="noopener"
							class="icon-button"
							aria-label="{location.name} location"
							title="{location.name} location"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<path d="M3 7l6 -3l6 3l6 -3v13l-6 3l-6 -3l-6 3v-13" />
								<path d="M9 4v13" />
								<path d="M15 7v13" />
							</svg>
						</a>
						<!-- eslint-enable svelte/no-navigation-without-resolve -->
					</p>
				{/if}
				<span class="price">{formatPrice(treat.price)}</span>
			</div>

			<time datetime={treat.date}>{formatDate(treat.date)}</time>

			{#if treat.review}
				<p class="review">Thoughts: {treat.review}</p>
			{/if}
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

	.model {
		max-width: 360px;
	}

	.info {
		font-family: var(--font-sans);
	}

	h2 {
		margin: 0 0 var(--space-2);
		font-family: var(--font-serif);
		font-size: var(--font-size-xl);
		color: var(--color-fg-primary);
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-2) var(--space-4);
		color: var(--color-fg-muted);
	}

	.location {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin: 0;
	}

	a {
		color: inherit;
	}

	.icon-button {
		display: inline-flex;
	}

	time {
		display: block;
		margin: var(--space-2) 0;
		color: var(--color-fg-muted);
		font-size: var(--font-size-sm);
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
