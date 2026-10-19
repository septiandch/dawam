<script lang="ts">
  import { onMount } from 'svelte';
  import { RefreshCw } from '@lucide/svelte';

  import AppFooter from '$lib/components/AppFooter.svelte';
  import AppHeader from '$lib/components/AppHeader.svelte';
  import CategoryCard from '$lib/components/home/CategoryCard.svelte';
  import InstallCard from '$lib/components/home/InstallCard.svelte';
  import { Button } from '$lib/components/ui/button';

  import { categories } from '$lib/content';
  import { categoryGroups } from '$lib/content/category-groups';
  import { applyUpdate, initInstall, install, installApp } from '$lib/install.svelte';

  onMount(() => initInstall());
</script>

<AppHeader />

<main id="main" class="mx-auto max-w-200 px-4 pt-2">
  <h1
    class="mb-4 p-4 text-center font-serif text-xl font-normal leading-tight tracking-[-0.04em] text-primary md:text-4xl"
  >
    Hanya dengan mengingat Allah,
    <br />
    Hati menjadi tenang.
  </h1>

  {#each categoryGroups as group (group.kind)}
    <section class="mt-6" aria-labelledby={'heading-' + group.kind}>
      <h2
        id={'heading-' + group.kind}
        class="mb-3 flex items-center gap-4 text-center text-base font-semibold text-muted-foreground"
      >
        <span class="h-px flex-1 bg-border" aria-hidden="true"></span>
        <span class="shrink-0">{group.title}</span>
        <span class="h-px flex-1 bg-border" aria-hidden="true"></span>
      </h2>
      <ul class="space-y-3">
        {#each categories.filter((category) => category.kind === group.kind) as category (category.id)}
          <li><CategoryCard {category} /></li>
        {/each}
      </ul>
    </section>
  {/each}

  {#if install.ready && !install.installed}
    <InstallCard
      canInstall={!!install.promptEvent}
      installing={install.installing}
      oninstall={installApp}
    />
  {:else if install.ready && install.installed && install.update}
    <div class="mt-8 text-center">
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
