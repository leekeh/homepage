<script lang="ts">
	import IconJob from '@icons/IconJob.svelte';
	import pf from './pf.webp';
	import IconUserCircle from '@icons/IconUserCircle.svelte';
	import Button from '@components/OS/Button.svelte';
</script>

<section class="img-section">
	<img src={pf} alt="" width="600" height="600" fetchpriority="high" />
	<div class="info">
		<p class="tag squiggle-border">New here</p>
		<p class="name">Lieke, 30</p>
		<p class="item"><IconUserCircle /> She/her</p>
		<p class="item"><IconJob /> Senior web developer</p>
	</div>
	<div class="actions">
		<a
			class="credit"
			href="https://picrew.me/en/image_maker/2771936"
			target="_blank"
			rel="noopener"
		>
			Image credit
		</a>
		<Button iconOnly href="/contact" aria-label="hire me">
			<svg viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
				<g>
					<path
						fill="#E1C8F9"
						d="m59.5,25.4802c0-6.9036-5.5964-12.5-12.5-12.5-4.7533,0-8.8861,2.6536-11,6.5598-2.1139-3.9062-6.2467-6.5598-11-6.5598-6.9036,0-12.5,5.5964-12.5,12.5,0,2.9699,1.0403,5.6942,2.7703,7.8387l-.0043.0034,20.734,25.6976,20.7339-25.6975-.0043-.0034c1.7301-2.1446,2.7704-4.8689,2.7704-7.8388Z"
					/>
				</g>
				<g>
					<path
						fill="none"
						stroke="#000"
						stroke-linejoin="round"
						stroke-width="2"
						d="m59.5,25.4802c0-6.9036-5.5964-12.5-12.5-12.5-4.7533,0-8.8861,2.6536-11,6.5598-2.1139-3.9062-6.2467-6.5598-11-6.5598-6.9036,0-12.5,5.5964-12.5,12.5,0,2.9699,1.0403,5.6942,2.7703,7.8387l-.0043.0034,20.734,25.6976,20.7339-25.6975-.0043-.0034c1.7301-2.1446,2.7704-4.8689,2.7704-7.8388Z"
					/>
				</g>
			</svg>
		</Button>
	</div>
</section>

<style>
	.img-section {
		position: relative;
		aspect-ratio: 1/1;
		color: white;
		font-size: var(--font-size-lg);
		font-weight: 800;
		/* gradient on the bottom */
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 0.7) 100%);
		padding: var(--space-4);
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		justify-content: space-between;
		border-radius: var(--radius-lg) var(--radius-lg) 0 0;
		overflow: hidden;

		.name {
			font-size: var(--font-size-xl);
		}

		.info {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-2);

			.item {
				font-size: var(--font-size-sm);
				display: flex;
				gap: var(--space-2);
				align-items: center;

				:global(svg) {
					width: 1.4em;
					height: 1.4em;
					stroke-width: 1.5;
				}
			}
		}
		.actions {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;
			height: 100%;
		}
		img {
			position: absolute;
			inset: 0;
			width: 100%;
			height: 100%;
			object-fit: cover;
			z-index: -1;
		}

		.credit {
			font-size: var(--font-size-xs);
		}
	}

	.tag {
		background-color: var(--color-bg-highlight);
		color: var(--color-fg-primary);
		padding: var(--space-2) var(--space-4);
		border-radius: var(--radius-round);
		font-size: var(--font-size-xs);
		font-family: var(--font-mono);
		font-weight: 600;
	}
</style>
