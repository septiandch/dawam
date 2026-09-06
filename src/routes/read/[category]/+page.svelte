<script lang="ts">
  import { ArrowLeft, BookOpen, Check } from '@lucide/svelte';

  import AppFooter from '$lib/components/AppFooter.svelte';
  import Settings from '$lib/components/Settings.svelte';
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

<main id="main" class="mx-auto max-w-200 px-4 md:px-6">
  <div class="px-1 py-8 md:px-0 md:pb-9 md:pt-11">
    <span
      class="flex items-center gap-2 text-[10px] font-semibold tracking-[0.18em] text-secondary-foreground"
    >
      <BookOpen class="size-3.5" /> DZIKIR HARIAN
    </span>
    <h1 class="my-3 font-serif text-[32px] font-normal tracking-tight md:text-[37px]">
      {data.category.title}
    </h1>
    <p class="mb-3 text-sm leading-7 text-muted-foreground">{data.category.description}</p>
    <span class="text-[11px] text-muted-foreground">
      {data.entries.length} bacaan · Baca dengan tenang, tanpa terburu-buru
    </span>
  </div>

  {#each data.entries as entry, index (entry.id)}
    <ReadingItem {entry} {index} />
  {:else}
    <p class="py-6 text-sm text-muted-foreground">Belum ada bacaan dalam kategori ini.</p>
  {/each}

  <div class="pb-15 pt-8 text-center">
    <Check class="mx-auto size-6 text-secondary-foreground" />
    <h2 class="mb-2.5 mt-4 font-serif text-2xl font-normal">Alhamdulillah.</h2>
    <p class="text-[13px] leading-7 text-muted-foreground">
      Semoga Allah menerima setiap dzikir kita.
    </p>
    <Button href="/" class="mt-5">Kembali ke beranda <ArrowLeft class="size-4" /></Button>
  </div>
</main>

<AppFooter reading />
