<script lang="ts">
  import { ArrowLeft, ArrowRight, Search } from '@lucide/svelte';
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import { canonicalSlug } from '$lib/content/slugs';

  import Settings from '$lib/components/Settings.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import CardSequence from '$lib/components/reading/CardSequence.svelte';
  import ReadingOpening from '$lib/components/reading/ReadingOpening.svelte';
  import ReadingClosing from '$lib/components/reading/ReadingClosing.svelte';
  import ReadingItem from '$lib/components/reading/ReadingItem.svelte';
  import ReadingListButton from '$lib/components/reading/ReadingListButton.svelte';
  import { Button } from '$lib/components/ui/button';

  let { data } = $props();

  let search = $state('');
  let mounted = $state(false);
  onMount(() => {
    mounted = true;
  });

  // Static HTML uses the category default; query overrides apply after hydration.
  const requestedMode = $derived(mounted ? page.url.searchParams.get('mode') : null);
  const mode = $derived(
    data.category.readingMode === 'single' || requestedMode === 'single' ? 'single' : 'sequence',
  );
  const selectedSlug = $derived(mounted ? page.url.searchParams.get('start') : null);
  const initialIndex = $derived(
    selectedSlug
      ? data.entries.findIndex((entry) => entry.slug === canonicalSlug(selectedSlug)) + 1
      : 0,
  );
  const filteredEntries = $derived(
    data.entries.filter((entry) =>
      `${entry.title} ${entry.translation}`
        .toLocaleLowerCase('id')
        .includes(search.trim().toLocaleLowerCase('id')),
    ),
  );
  $effect(() => {
    data.category.slug;
    mode;
    search = '';
  });
</script>

<svelte:head>
  <title>{data.category.title} — Dawam</title>
  <meta name="description" content={data.category.description} />
</svelte:head>

<header class="sticky top-0 z-10 border-b bg-background/95 backdrop-blur-md">
  <div class="mx-auto flex max-w-200 items-center gap-2 p-4">
    <Button
      variant="outline"
      size="icon"
      href={mode === 'single' && data.category.readingMode === 'sequence'
        ? '/read/' + data.category.slug + '/'
        : '/'}
      class="shrink-0 rounded-full bg-transparent shadow-none"
      aria-label={mode === 'single' && data.category.readingMode === 'sequence'
        ? 'Kembali ke bacaan'
        : 'Kembali ke beranda'}
    >
      <ArrowLeft class="size-5" />
    </Button>

    <span class="min-w-0 flex-1 md:ml-4 text-left text-sm md:text-xl">
      {data.category.title}
    </span>

    <div class="flex shrink-0 items-center gap-2">
      <ReadingListButton categorySlug={data.category.slug} active={mode === 'single'} />
      <div class="hidden md:block"><ThemeToggle /></div>
      <Settings />
    </div>
  </div>
</header>

<div class="pb-[calc(5rem+env(safe-area-inset-bottom))]">
  <main id="main" class="mx-auto max-w-200 px-4 py-4 md:px-6 md:py-5">
    {#if mode === 'single'}
      <label for="reading-search" class="mb-2 block text-xs font-medium">Cari bacaan</label>
      <div class="relative">
        <Search
          class="pointer-events-none absolute left-3 top-3 size-5 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          id="reading-search"
          type="search"
          bind:value={search}
          placeholder="Cari nama atau arti bacaan…"
          class="min-h-11 w-full rounded-xl border bg-background py-3 pl-10 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <ul class="space-y-3 mt-4">
        {#each filteredEntries as entry (entry.id)}
          <li>
            <a
              href={data.category.readingMode === 'sequence'
                ? '/read/' +
                  data.category.slug +
                  '/?mode=sequence&start=' +
                  encodeURIComponent(entry.slug)
                : '/read/' + data.category.slug + '/' + entry.slug + '/'}
              class="flex min-h-16 items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
            >
              <span class="min-w-0 flex-1 text-sm font-medium">{entry.title}</span>
              <ArrowRight class="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            </a>
          </li>
        {/each}
      </ul>
      {#if !filteredEntries.length}
        <p class="py-8 text-center text-sm text-muted-foreground">
          Tidak ada bacaan yang cocok. Coba kata kunci lain.
        </p>
      {/if}
    {:else}
      {#key data.category.slug + ':' + initialIndex}
        <CardSequence readingCount={data.entries.length} {initialIndex}>
          {#snippet children(index)}
            {#if index === 0}
              <ReadingOpening category={data.category} count={data.entries.length} />
            {:else if index === data.entries.length + 1}
              <ReadingClosing />
            {:else}
              <ReadingItem entry={data.entries[index - 1]} index={index - 1} />
            {/if}
          {/snippet}
        </CardSequence>
      {/key}
    {/if}
  </main>
</div>
