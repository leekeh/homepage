<script lang="ts">
	import { Image } from '@components';
	export let data;
	import { afterNavigate } from '$app/navigation';

	$: ({ title, imageSrc, summary, lang, creationDate, editDate } = data);

	let mainContainer: HTMLElement;

	afterNavigate(() => {
		mainContainer.scrollTo(0, 0);
	});

	let titleHeight = 0;

	const formatDate = (date: string) =>
		new Date(date).toLocaleDateString(lang, {
			month: 'long',
			year: 'numeric',
			day: 'numeric'
		});
</script>

<svelte:head>
	<title>{title} - leekeh</title>
	<meta name="description" content={summary} />
	<meta property="og:image" content={imageSrc} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={summary} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
</svelte:head>

<main id="main" bind:this={mainContainer}>
	<div class="header" style={`min-height: ${titleHeight}px`}>
		<Image
			src={imageSrc}
			alt={title}
			width="100%"
			height="auto"
			aspectRatio="1200 / 630"
			style="border-radius: 0; max-height: 50vh"
		/>
		<h1 bind:clientHeight={titleHeight}>{title}</h1>
	</div>
	<article>
		Written: <time datetime={creationDate}>{formatDate(creationDate)}</time>
		Last edited:
		<time datetime={editDate}>{formatDate(editDate)}</time>
		<slot />
	</article>
</main>
<nav />

<style>
	/* .mainContainer {
		padding: 1rem;
		height: 100%;
		width: 100%;
		overflow: auto;
		box-sizing: border-box;
	} */
	.header {
		position: relative;
		width: 100%;
	}

	article {
		padding: 1rem;
	}

	h1 {
		font-size: 2rem;
		position: relative;
		background-color: var(--foreground);
		color: var(--bg-primary);
		text-align: center;
		padding: 1rem;
		width: 100%;
		text-wrap: balance;
	}

	@media (min-width: 480px) {
		h1 {
			position: absolute;
			bottom: 0;
			text-align: center;
			left: 0;
			right: 0;
			margin-left: auto;
			margin-right: auto;
			max-width: 70%;
			border-radius: 1rem 1rem 0 0;
		}
	}

	article,
	main {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		align-items: start;
		width: 100%;
	}

	nav {
		padding-top: 0.6rem;
		display: flex;
		justify-content: space-between;
	}
</style>
