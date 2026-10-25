<script lang="ts">
  import { ArrowLeft } from '@lucide/svelte';

  import Settings from '$lib/components/Settings.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import ReadingItem from '$lib/components/reading/ReadingItem.svelte';
  import ReadingListButton from '$lib/components/reading/ReadingListButton.svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.entry.title} — Dawam</title>
  <meta name="description" content={data.entry.translation} />
</svelte:head>

<header class="sticky top-0 z-10 border-b bg-background/95 backdrop-blur-md">
  <div class="mx-auto flex max-w-200 items-center gap-2 p-4">
    <Button
      variant="outline"
      size="icon"
      href={'/read/' + data.category.slug + '/?mode=single'}
      class="shrink-0 rounded-full bg-transparent shadow-none"
      aria-label="Kembali ke daftar bacaan"
    >
      <ArrowLeft class="size-5" />
    </Button>
    <h1 class="min-w-0 flex-1 text-left text-sm font-medium">
      {data.category.title}
    </h1>
    <div class="flex shrink-0 items-center gap-2">
      <ReadingListButton categorySlug={data.category.slug} />
      <div class="hidden md:block"><ThemeToggle /></div>
      <Settings />
    </div>
  </div>
</header>

<main id="main" class="mx-auto max-w-200 px-4 py-5 md:px-6 md:py-8">
  <p class="mb-4 text-xs text-muted-foreground">Mode satu bacaan</p>
  <Card.Root class="gap-0 rounded-2xl border p-5 shadow-none ring-0 md:p-8">
    <ReadingItem entry={data.entry} index={data.index} />
  </Card.Root>
  <Button variant="outline" href={'/read/' + data.category.slug + '/?mode=single'} class="mt-5">
    <ArrowLeft class="size-4" /> Pilih bacaan lain
  </Button>
</main>
