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
		gap: var(--space-2);
		margin-bottom: var(--space-7);
	}

	.contact-link {
		display: flex;
		align-items: center;
		gap: var(--space-5);
		padding: var(--space-4) var(--space-5);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		text-decoration: none;
		color: var(--color-text);
		transition:
			background 0.1s,
			border-color 0.1s;
	}

	.contact-link:hover {
		background: var(--color-surface-alt);
		border-color: var(--color-primary);
	}

	.label {
		min-width: 10ch;
	}
</style>
