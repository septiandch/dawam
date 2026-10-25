<script lang="ts">
  import { onMount } from 'svelte';
  import { RefreshCw, Search, X, ArrowRight } from '@lucide/svelte';

  import AppFooter from '$lib/components/AppFooter.svelte';
  import AppHeader from '$lib/components/AppHeader.svelte';
  import CategoryCard from '$lib/components/home/CategoryCard.svelte';
  import InstallCard from '$lib/components/home/InstallCard.svelte';
  import { Button } from '$lib/components/ui/button';

  import { categories, readings } from '$lib/content';
  import { createSearchIndex, searchReadings } from '$lib/content/search.mjs';
  import { categoryGroups } from '$lib/content/category-groups';
  import { applyUpdate, initInstall, install, installApp } from '$lib/install.svelte';

  onMount(() => initInstall());

  let search = $state('');
  let searchInput: HTMLInputElement;
  const searchIndex = createSearchIndex(categories, readings);
  const results = $derived(searchReadings(searchIndex, search));
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

  <form role="search" onsubmit={(event) => event.preventDefault()}>
    <label for="all-readings-search" class="sr-only">Cari semua bacaan</label>
    <div class="relative">
      <Search
        class="pointer-events-none absolute left-3 top-3 size-5 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        bind:this={searchInput}
        id="all-readings-search"
        type="search"
        bind:value={search}
        placeholder="Cari bacaan…"
        class="min-h-11 w-full rounded-xl border bg-card py-3 pl-10 pr-12 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-search-cancel-button]:appearance-none"
        aria-controls="home-readings"
      />
      {#if search}
        <button
          type="button"
          aria-label="Hapus pencarian"
          class="absolute right-0 top-0 grid size-11 place-items-center rounded-xl text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          onclick={() => {
            search = '';
            searchInput.focus();
          }}
        >
          <X class="size-4" aria-hidden="true" />
        </button>
      {/if}
    </div>
  </form>

  <div id="home-readings">
    {#if search.trim()}
      <section class="mt-6" aria-label="Hasil pencarian">
        <p role="status" aria-live="polite" class="mb-3 text-xs text-muted-foreground">
          {results.length} bacaan ditemukan
        </p>
        <ul class="space-y-3">
          {#each results as result (result.id)}
            <li>
              <a
                href={result.href}
                class="flex min-h-16 items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
              >
                <div class="min-w-0 flex-1">
                  <span class="block text-sm font-medium">{result.title}</span>
                  <span class="mt-1 block text-xs text-muted-foreground">
                    {result.categoryTitle}
                  </span>
                </div>
                <ArrowRight class="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              </a>
            </li>
          {/each}
        </ul>
        {#if !results.length}
          <p class="py-6 text-center text-sm text-muted-foreground">
            Tidak ada bacaan yang cocok. Coba kata kunci lain.
          </p>
        {/if}
      </section>
    {:else}
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
    {/if}
  </div>

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
