<script lang="ts">
  import { ArrowLeft } from '@lucide/svelte';

  import Settings from '$lib/components/Settings.svelte';
  import CardSequence from '$lib/components/reading/CardSequence.svelte';
  import ReadingOpening from '$lib/components/reading/ReadingOpening.svelte';
  import ReadingClosing from '$lib/components/reading/ReadingClosing.svelte';
  import ReadingItem from '$lib/components/reading/ReadingItem.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Separator } from '$lib/components/ui/separator';

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.category.title} — Dawam</title>
  <meta name="description" content={data.category.description} />
  <meta property="og:title" content={data.category.title + ' — Dawam'} />
</svelte:head>

<header class="sticky top-0 z-10 border-b bg-background/95 backdrop-blur-md">
  <div
    class="mx-auto flex max-w-212.5 items-center gap-3 px-4 py-3 text-sm md:gap-4 md:px-6 md:py-4"
  >
    <Button
      variant="outline"
      size="icon"
      href="/"
      class="rounded-full bg-transparent shadow-none"
      aria-label="Kembali ke beranda"
    >
      <ArrowLeft class="size-5" />
    </Button>
    <a
      href="/"
      class="hidden text-[27px] font-semibold tracking-tight md:inline-flex"
      aria-label="Dawam beranda"
    >
      dawam
      <span class="text-gold">.</span>
    </a>
    <Separator orientation="vertical" class="hidden h-6 md:block" />
    <span>{data.category.title}</span>
    <div class="flex-1"></div>
    <Settings />
  </div>
</header>

<div class="pb-[calc(5rem+env(safe-area-inset-bottom))]">
  <main id="main" class="mx-auto max-w-200 px-4 py-5 md:px-6 md:py-8">
    {#key data.category.slug}
      <CardSequence total={data.entries.length + 2}>
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
  </main>
</div>
