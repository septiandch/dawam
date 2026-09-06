<script lang="ts">
  import { Sun, Sunset, ArrowUpRight, ArrowRight, BookOpen } from '@lucide/svelte';

  import * as Card from '$lib/components/ui/card';
  import { Separator } from '$lib/components/ui/separator';

  import { cn } from '$lib/utils';
  import type { Category } from '$lib/types/content';

  let { category }: { category: Category } = $props();

  const morning = $derived(category.slug === 'morning');
</script>

<a
  href={'/read/' + category.slug + '/'}
  class="group block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
>
  <Card.Root
    class={cn(
      'h-full gap-0 border px-6 py-5.5 shadow-none ring-0 transition-transform group-hover:-translate-y-0.5 group-hover:border-ring/50 motion-reduce:transform-none md:px-7 md:py-6',
      morning ? 'border-morning-border bg-morning' : 'border-evening-border bg-evening',
    )}
  >
    <div class="flex items-center gap-3">
      <span
        class={cn(
          'grid size-13 shrink-0 place-items-center rounded-2xl',
          morning
            ? 'bg-morning-accent text-morning-foreground'
            : 'bg-evening-accent text-evening-foreground',
        )}
      >
        {#if morning}
          <Sun class="size-7" strokeWidth={1.4} />
        {:else}
          <Sunset class="size-7" strokeWidth={1.4} />
        {/if}
      </span>
      <span class="text-[9px] font-medium tracking-[0.17em] text-muted-foreground">
        {morning ? 'MENYAMBUT HARI' : 'MENUTUP HARI'}
      </span>
      <ArrowUpRight class="ml-auto size-5 text-muted-foreground" />
    </div>

    <h3 class="mb-2 mt-5 font-serif text-[25px] font-normal">{category.title}</h3>
    <p class="mb-5 text-xs leading-7 text-muted-foreground md:max-w-80">{category.description}</p>

    <Separator class="mt-auto" />

    <div class="flex items-center justify-between gap-2 pt-4.5 text-[11px]">
      <span class="flex items-center gap-1.5 text-muted-foreground">
        <BookOpen class="size-3.5" />{category.itemIds.length} bacaan
      </span>
      <span class="flex items-center gap-1.5 font-semibold">
        Mulai membaca <ArrowRight class="size-4" />
      </span>
    </div>
  </Card.Root>
</a>
