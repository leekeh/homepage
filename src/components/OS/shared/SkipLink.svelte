<script lang="ts">
	type Props = {
		id: string;
	};

	let { id }: Props = $props();
</script>

<a class="skip" href={`#${id}`}>Skip to content</a>

<style>
	a {
		position: absolute;
		top: -40px;
		left: 0;
		background: var(--win-bg);
		color: var(--color-text);
		padding: 8px 16px;
		z-index: 1000;
	}

	a:focus {
		top: 8px;
	}
</style>
