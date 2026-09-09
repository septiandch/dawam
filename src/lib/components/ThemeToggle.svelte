<script lang="ts">
  import { Moon, Sun } from '@lucide/svelte';
  import { Button } from '$lib/components/ui/button';
  import { preferences, savePreferences } from '$lib/preferences.svelte';

  function toggleTheme() {
    preferences.darkMode = !preferences.darkMode;
    savePreferences();
  }
</script>

<Button
  variant="outline"
  size="icon"
  class="shrink-0 rounded-full bg-transparent shadow-none"
  aria-label="Mode gelap"
  aria-pressed={preferences.darkMode}
  title={preferences.darkMode ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
  onclick={toggleTheme}
>
  {#if preferences.darkMode}
    <Sun class="size-5" />
  {:else}
    <Moon class="size-5" />
  {/if}
</Button>
