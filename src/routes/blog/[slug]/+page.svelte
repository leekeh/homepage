<script lang="ts">
  import { page } from "$app/stores";

  let slug = $derived($page.params.slug);
</script>

<svelte:head>
  <title>{slug} — Blog — lieke.dev</title>
</svelte:head>

<noscript>
  <div class="noscript-content">
    <p><a href="/blog">← Back to blog</a></p>
    <h1>{slug}</h1>
    <p>Enable JavaScript to read this post in the retro desktop view.</p>
  </div>
</noscript>
