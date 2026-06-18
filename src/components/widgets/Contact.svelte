<script lang="ts">
</script>

<div class="contact">
	<p class="intro">Want to get in touch? Here are some ways to reach me.</p>

	<address class="links">
		<a class="contact-link" href="mailto:hello@leekeh.com">
			<span class="label">Email</span>
			<span class="value">hello@leekeh.com</span>
		</a>
		<a class="contact-link" href="https://github.com/leekeh/" target="_blank" rel="noopener">
			<span class="label">GitHub</span>
			<span class="value">leekeh</span>
		</a>
		<a
			class="contact-link"
			href="https://bsky.app/profile/leekeh.com"
			target="_blank"
			rel="noopener"
		>
			<span class="label">Bluesky</span>
			<span class="value">@leekeh.com </span>
		</a>
		<a
			class="contact-link"
			href="https://www.linkedin.com/in/leekeh/"
			target="_blank"
			rel="noopener"
		>
			<span class="label">LinkedIn</span>
			<span class="value">leekeh </span>
		</a>
	</address>
</div>

<style>
	address {
		font-style: normal;
	}
	.contact {
		padding: var(--space-6);
		font-family: var(--font-mono);
		height: 100%;
		overflow-y: auto;
	}

	.links {
		display: flex;
		flex-direction: column;
		margin-bottom: var(--space-7);
	}

	.contact-link {
		display: flex;
		align-items: center;
		gap: var(--space-5);
		text-decoration: none;
		color: var(--color-text);
		padding: var(--space-2) var(--space-3);
	}

	.contact-link:hover {
		background-color: var(--color-bg-preview);
	}

	.contact-link:active {
		background-color: var(--color-bg-highlight);
	}

	.label {
		min-width: 10ch;
	}
</style>
