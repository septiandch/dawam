<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';

  import { loadPreferences, preferences } from '$lib/preferences.svelte';

  let { children } = $props();

  let ready = $state(false);
  onMount(() => {
    loadPreferences();
    ready = true;
  });

  $effect(() => {
    if (ready) document.documentElement.classList.toggle('dark', preferences.darkMode);
  });
</script>

<a
  class="fixed -top-24 left-4 z-100 rounded-md bg-card p-3 text-sm shadow-md focus:top-3"
  href="#main"
>
  Langsung ke konten
</a>

{@render children()}
