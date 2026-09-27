<script lang="ts">
  import { ArrowUpRight } from '@lucide/svelte';

  let { reading = false }: { reading?: boolean } = $props();
</script>

<footer class="mx-auto flex max-w-200 items-center gap-3 p-4 text-[9px]">
  <div class="flex w-full flex-wrap items-center gap-x-3 gap-y-1 border-t md:gap-x-4">
    <span class="pt-1 text-muted-foreground hidden md:block">
      Amal terbaik adalah yang rutin walau sedikit.
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
