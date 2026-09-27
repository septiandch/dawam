<script lang="ts">
  import { onMount } from 'svelte';
  import { Sun, BookOpen, WifiOff, Heart, Check, RefreshCw } from '@lucide/svelte';

  import AppFooter from '$lib/components/AppFooter.svelte';
  import AppHeader from '$lib/components/AppHeader.svelte';
  import CategoryCard from '$lib/components/home/CategoryCard.svelte';
  import InstallCard from '$lib/components/home/InstallCard.svelte';
  import { Button } from '$lib/components/ui/button';

  import categories from '$lib/content/categories.json';
  import { applyUpdate, initInstall, install, installApp } from '$lib/install.svelte';

  onMount(() => initInstall());
</script>

<AppHeader />

<main id="main" class="mx-auto max-w-200 px-4 pt-2">
  <h1
    class="mb-4 text-primary text-center font-serif text-xl font-normal leading-tight tracking-[-0.04em] md:text-4xl border-b border-t p-4"
  >
    Hanya dengan mengingat Allah,
    <br />
    Hati menjadi tenang.
  </h1>

  <section class="mt-8" aria-labelledby="daily-heading">
    <h2
      id="daily-heading"
      class="my-2.5 font-serif text-[26px] font-normal tracking-tight md:text-[29px]"
    >
      Dzikir harian
    </h2>

    <div class="grid gap-4 md:grid-cols-2 md:gap-5.5">
      {#each categories as category (category.id)}
        <CategoryCard {category} />
      {/each}
    </div>
  </section>

  {#if install.ready && !install.installed}
    <InstallCard
      canInstall={!!install.promptEvent}
      installing={install.installing}
      oninstall={installApp}
    />
  {/if}

  {#if install.update}
    <div class="mt-4 text-center">
      <Button
        variant="secondary"
        onclick={applyUpdate}
        class="h-auto min-h-11 whitespace-normal text-xs"
      >
        <RefreshCw class="size-4" /> Versi baru tersedia. Perbarui aplikasi
      </Button>
    </div>
  {/if}
</main>

<AppFooter />
