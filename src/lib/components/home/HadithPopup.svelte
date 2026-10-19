<script lang="ts">
  import { onMount } from 'svelte';
  import { BookOpen } from '@lucide/svelte';
  import XIcon from '@lucide/svelte/icons/x';

  import HadithCard from '$lib/components/home/HadithCard.svelte';
  import { buttonVariants } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import { hadiths } from '$lib/content/hadiths';
  import { dailyIndex, dailyKey } from '$lib/utils/daily.mjs';

  const seenKey = 'dawam-hadith-seen';

  let open = $state(false);
  let today = $state(new Date());
  let content = $state<HTMLElement | null>(null);

  const hadith = $derived(hadiths[dailyIndex(today, hadiths.length)]);

  onMount(() => {
    // Auto-open only on the first visit each day. Refreshing or returning from the
    // reader leaves the key in place, so the popup stays closed until it's reopened
    // from the header button.
    const dayKey = dailyKey();

    try {
      if (localStorage.getItem(seenKey) !== dayKey) {
        localStorage.setItem(seenKey, dayKey);
        open = true;
      }
    } catch {
      // Storage unavailable: fall back to showing the popup on every load.
      open = true;
    }

    const timer = setInterval(() => (today = new Date()), 30000);

    return () => clearInterval(timer);
  });
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger
    class={buttonVariants({
      variant: 'outline',
      class: 'h-11 shrink-0 gap-1.5 rounded-full bg-transparent px-3 shadow-none md:px-4',
    })}
    aria-label="Nasihat Hari Ini"
  >
    <BookOpen class="size-4" />
    <span class="hidden whitespace-nowrap sm:inline">Nasihat Hari Ini</span>
  </Dialog.Trigger>

  <Dialog.Content
    bind:ref={content}
    onOpenAutoFocus={(e) => {
      e.preventDefault();
      content?.focus();
    }}
    class="p-0 md:p-0 min-w-9/12 bg-hero"
    showCloseButton={false}
  >
    <Dialog.Title class="sr-only">Nasihat Hari Ini</Dialog.Title>
    <HadithCard {hadith} />

    <Dialog.Close
      class="absolute top-3 right-3 px-2 py-1 z-20 hover:underline flex gap-1 items-center rounded-full bg-hero/70 text-hero-foreground transition-colors hover:bg-hero"
      aria-label="Tutup dialog"
    >
      <span>Tutup</span>
      <XIcon class="size-6" />
    </Dialog.Close>
  </Dialog.Content>
</Dialog.Root>
