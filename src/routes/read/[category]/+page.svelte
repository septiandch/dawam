<script lang="ts">
  import { ArrowLeft } from '@lucide/svelte';

  import Settings from '$lib/components/Settings.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import CardSequence from '$lib/components/reading/CardSequence.svelte';
  import ReadingOpening from '$lib/components/reading/ReadingOpening.svelte';
  import ReadingClosing from '$lib/components/reading/ReadingClosing.svelte';
  import ReadingItem from '$lib/components/reading/ReadingItem.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Separator } from '$lib/components/ui/separator';

  let { data } = $props();
</script>

<header class="sticky top-0 z-10 border-b bg-background/95 backdrop-blur-md">
  <div class="mx-auto flex max-w-200 items-center gap-2 p-4">
    <Button
      variant="outline"
      size="icon"
      href="/"
      class="rounded-full bg-transparent shadow-none"
      aria-label="Kembali ke beranda"
    >
      <ArrowLeft class="size-5" />
    </Button>

    <span class="text-xl flex-1 text-center">{data.category.title}</span>

    <div class="flex items-center gap-2">
      <ThemeToggle />
      <Settings />
    </div>
  </div>
</header>

<div class="pb-[calc(5rem+env(safe-area-inset-bottom))]">
  <main id="main" class="mx-auto max-w-200 px-4 py-5 md:px-6 md:py-8">
    {#key data.category.slug}
      <CardSequence readingCount={data.entries.length}>
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
