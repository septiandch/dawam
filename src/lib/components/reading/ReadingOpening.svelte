<script lang="ts">
  import { BookOpen, ChevronRight } from '@lucide/svelte';

  import type { Category } from '$lib/types/content';
  import { categoryGroups } from '$lib/content/category-groups';

  let { category, count }: { category: Category; count: number } = $props();
</script>

<div class="flex flex-1 flex-col justify-center py-10 md:py-16">
  <span
    class="flex items-center gap-2 text-[10px] font-semibold tracking-[0.18em] text-secondary-foreground"
  >
    <BookOpen class="size-3.5" />
    {categoryGroups.find((group) => group.kind === category.kind)?.title.toLocaleUpperCase('id')}
  </span>

  <h1 class="my-3 font-serif text-[32px] font-normal tracking-tight md:text-[37px]">
    {category.title}
  </h1>

  <p class="mb-3 text-sm leading-7 text-muted-foreground">{category.description}</p>

  <p class="text-[11px] leading-6 text-muted-foreground">
    {count} bacaan · Baca dengan tenang, tanpa terburu-buru
  </p>

  <p class="mt-8 text-xs leading-6 text-secondary-foreground">
    {#if count > 0}
      Tekan
      <span
        class="mx-1 inline-flex items-center justify-center rounded-md bg-muted p-0.5 align-middle min-[375px]:px-1.5 min-[375px]:align-baseline"
      >
        <span class="inline-flex min-[375px]:hidden">
          <ChevronRight class="size-4" aria-hidden="true" />
          <span class="sr-only">Berikutnya</span>
        </span>
        <span class="hidden min-[375px]:inline">Berikutnya</span>
      </span>
      untuk mulai membaca.
    {:else}
      Belum ada bacaan dalam kategori ini.
    {/if}
  </p>
</div>
