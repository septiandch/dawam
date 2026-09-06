<script lang="ts">
  import { tick, type Snippet } from 'svelte';
  import { ChevronLeft, ChevronRight } from '@lucide/svelte';

  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';

  let { total, children }: { total: number; children: Snippet<[number]> } = $props();

  let currentIndex = $state(0);
  let cardRegion: HTMLElement;

  async function goToCard(index: number) {
    if (index < 0 || index >= total) return;

    currentIndex = index;

    await tick();

    cardRegion.focus({ preventScroll: true });
    cardRegion.scrollIntoView({ block: 'start', behavior: 'instant' });
  }
</script>

<section
  bind:this={cardRegion}
  tabindex="-1"
  aria-label={`Kartu ${currentIndex + 1} dari ${total}`}
  class="scroll-mt-24 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
>
  <Card.Root
    class="min-h-[calc(100dvh-12rem)] gap-0 overflow-visible rounded-2xl border p-5 shadow-none ring-0 md:p-8"
  >
    {#key currentIndex}
      {@render children(currentIndex)}
    {/key}
  </Card.Root>
</section>

<nav
  aria-label="Navigasi bacaan"
  class="fixed inset-x-0 bottom-0 z-20 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md"
>
  <div
    class="mx-auto grid max-w-200 grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-3 md:gap-6 md:px-6"
  >
    <Button
      variant="outline"
      class="justify-self-start px-3 md:px-4"
      disabled={currentIndex === 0}
      onclick={() => goToCard(currentIndex - 1)}
    >
      <ChevronLeft class="size-4" />
      <span class="sr-only min-[375px]:not-sr-only">Sebelumnya</span>
    </Button>

    <span
      role="status"
      aria-live="polite"
      aria-atomic="true"
      class="whitespace-nowrap text-xs tabular-nums text-muted-foreground"
    >
      {currentIndex + 1} dari {total}
    </span>

    <Button
      class="justify-self-end px-3 md:px-4"
      disabled={currentIndex === total - 1}
      onclick={() => goToCard(currentIndex + 1)}
    >
      <span class="sr-only min-[375px]:not-sr-only">Berikutnya</span>
      <ChevronRight class="size-4" />
    </Button>
  </div>
</nav>
