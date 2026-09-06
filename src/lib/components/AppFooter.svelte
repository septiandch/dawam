<script lang="ts">
  import { ArrowUpRight } from '@lucide/svelte';

  let { reading = false }: { reading?: boolean } = $props();
</script>

<footer
  class="mx-auto flex max-w-280 items-center gap-3 px-5.5 py-6 text-[9px] md:gap-4 md:px-9 md:text-[11px]"
>
  <div class="flex w-full flex-wrap items-center gap-x-3 gap-y-1 border-t pt-6 md:gap-x-4">
    <a
      href="/"
      class="inline-flex min-h-11 items-center text-[23px] font-semibold tracking-tight"
      aria-label="Dawam beranda"
    >
      dawam
      <span class="text-gold">.</span>
    </a>
    <span class="text-muted-foreground">
      {reading ? 'Teman dalam mengingat-Nya.' : 'Sedikit, tetapi istiqamah.'}
    </span>

    {#if !reading}
      <a
        href="https://github.com/fitrahive/dua-dhikr"
        target="_blank"
        rel="noreferrer"
        class="ml-auto inline-flex min-h-11 items-center gap-1 text-muted-foreground hover:text-primary"
      >
        Sumber bacaan <ArrowUpRight class="size-3" />
      </a>
    {/if}
  </div>
</footer>
