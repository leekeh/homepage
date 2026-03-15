<script lang="ts">
</script>

<div class="about">
  <div class="header">
    <pre class="ascii-art">readme.txt</pre>
  </div>
  <div class="content">
    <h1>Hello!</h1>
    <p>
      Welcome to my little corner of the internet. I'm a developer who enjoys
      building things for the web — and occasionally painting digital leaves.
    </p>
    <p>
      This site is styled like a retro desktop because I grew up clicking
      through Windows 95 and thought it'd be fun to bring that energy to a
      personal site.
    </p>

    <h2>What I do</h2>
    <ul>
      <li>Frontend & full-stack web development</li>
      <li>Creative coding & generative art</li>
      <li>Accessibility advocacy</li>
      <li>Writing about things I learn</li>
    </ul>

    <h2>Elsewhere</h2>
    <ul class="links">
      <li>
        <a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
      </li>
      <li>
        <a href="https://mastodon.social" target="_blank" rel="noopener"
          >Mastodon</a
        >
      </li>
    </ul>
  </div>
</div>

<style>
  .about {
    padding: var(--space-6);
    font-family: var(--font-mono);
    height: 100%;
    overflow-y: auto;
  }

  .header {
    margin-bottom: var(--space-6);
  }

  .ascii-art {
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
    line-height: 1.4;
  }

  .content h1 {
    font-size: var(--font-size-xl);
    color: var(--color-primary);
    margin-bottom: var(--space-5);
    font-family: var(--font-serif);
  }

  .content h2 {
    font-size: var(--font-size-md);
    color: var(--color-primary-dark);
    margin-top: var(--space-7);
    margin-bottom: var(--space-4);
    border-bottom: 1px solid var(--color-border);
    padding-bottom: var(--space-2);
  }

  .content p {
    line-height: 1.6;
    margin-bottom: var(--space-5);
    color: var(--color-text);
  }

  .content ul {
    list-style: none;
    padding-left: var(--space-5);
  }

  .content ul li {
    position: relative;
    padding-left: var(--space-5);
    margin-bottom: var(--space-3);
    line-height: 1.5;
  }

  .content ul li::before {
    content: ">";
    position: absolute;
    left: 0;
    color: var(--color-primary);
  }

  .links a {
    color: var(--color-link);
    text-decoration: underline;
  }

  .links a:hover {
    color: var(--color-link-hover);
  }
</style>
