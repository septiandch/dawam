<script lang="ts">
  import { onMount } from 'svelte';
  import { RefreshCw } from '@lucide/svelte';

  import FloatingAction from './FloatingAction.svelte';
  import InstallCard from './InstallCard.svelte';
  import { Button } from '$lib/components/ui/button';
  import { applyUpdate, initInstall, install, installApp } from '$lib/install.svelte';

  onMount(() => initInstall());
</script>

{#if install.ready && (!install.installed || install.update)}
  <FloatingAction>
    {#if !install.installed}
      <InstallCard
        canInstall={!!install.promptEvent}
        installing={install.installing}
        oninstall={installApp}
      />
    {:else}
      <Button onclick={applyUpdate} class="h-auto min-h-11 whitespace-normal text-xs">
        <RefreshCw class="size-4" /> Versi baru tersedia. Perbarui aplikasi
      </Button>
    {/if}
  </FloatingAction>
{/if}
