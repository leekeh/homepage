<script lang="ts">
</script>

<div class="contact">
  <h1>Contact</h1>
  <p class="intro">Want to get in touch? Here are some ways to reach me.</p>

  <div class="links">
    <a href="mailto:hello@lieke.dev" class="contact-link">
      <span class="label">Email</span>
      <span class="value">hello@lieke.dev</span>
    </a>
    <a
      href="https://github.com"
      target="_blank"
      rel="noopener"
      class="contact-link"
    >
      <span class="label">GitHub</span>
      <span class="value">@lieke</span>
    </a>
    <a
      href="https://mastodon.social"
      target="_blank"
      rel="noopener"
      class="contact-link"
    >
      <span class="label">Mastodon</span>
      <span class="value">@lieke@mastodon.social</span>
    </a>
  </div>

  <div class="note">
    <p>
      Feel free to drop a message about projects, collaborations, or just to say
      hi.
    </p>
  </div>
</div>

<style>
  .contact {
    padding: var(--space-6);
    font-family: var(--font-mono);
    height: 100%;
    overflow-y: auto;
  }

  h1 {
    font-size: var(--font-size-lg);
    color: var(--color-primary);
    font-family: var(--font-serif);
    margin-bottom: var(--space-4);
  }

  .intro {
    color: var(--color-text-muted);
    margin-bottom: var(--space-7);
    line-height: 1.5;
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
    font-weight: 600;
    min-width: 80px;
    color: var(--color-primary);
  }

  .value {
    color: var(--color-text);
  }

  .note {
    border-top: 1px solid var(--color-border);
    padding-top: var(--space-5);
  }

  .note p {
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
    line-height: 1.5;
  }
</style>
