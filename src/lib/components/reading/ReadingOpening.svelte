<script lang="ts">
  import { BookOpen } from '@lucide/svelte';

  import type { Category } from '$lib/types/content';

  let { category, count }: { category: Category; count: number } = $props();
</script>

<div class="flex flex-1 flex-col justify-center py-10 md:py-16">
  <span
    class="flex items-center gap-2 text-[10px] font-semibold tracking-[0.18em] text-secondary-foreground"
  >
    <BookOpen class="size-3.5" /> DZIKIR HARIAN
  </span>

  <h1 class="my-3 font-serif text-[32px] font-normal tracking-tight md:text-[37px]">
    {category.title}
  </h1>

  <p class="mb-3 text-sm leading-7 text-muted-foreground">{category.description}</p>

  <p class="text-[11px] leading-6 text-muted-foreground">
    {count} bacaan · Baca dengan tenang, tanpa terburu-buru
  </p>

  <p class="mt-8 text-xs leading-6 text-secondary-foreground">
    {count > 0 ? 'Tekan Berikutnya untuk mulai membaca.' : 'Belum ada bacaan dalam kategori ini.'}
  </p>
</div>
