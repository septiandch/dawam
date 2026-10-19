<script lang="ts">
  import { onMount } from 'svelte';
  import { List } from '@lucide/svelte';

  import { Button } from '$lib/components/ui/button';

  let { categorySlug, active = false }: { categorySlug: string; active?: boolean } = $props();

  let showHint = $state(false);
  const hintId = $props.id();

  onMount(() => {
    try {
      showHint = localStorage.getItem('dawam-reading-list-hint-seen') !== 'true';
      if (showHint) localStorage.setItem('dawam-reading-list-hint-seen', 'true');
    } catch {
      // The reader remains usable when browser storage is unavailable.
      showHint = true;
    }
  });
</script>

<svelte:window
  onkeydown={(event) => {
    if (event.key === 'Escape') showHint = false;
  }}
/>

<div class="relative shrink-0">
  <Button
    variant={active ? 'secondary' : 'outline'}
    size="icon"
    href={'/read/' + categorySlug + '/?mode=single'}
    class="rounded-full shadow-none"
    aria-label="Pilih bacaan"
    aria-current={active ? 'page' : undefined}
    aria-describedby={showHint ? hintId : undefined}
    onclick={() => {
      showHint = false;
    }}
  >
    <List class="size-5" aria-hidden="true" />
  </Button>
  {#if showHint}
    <aside
      id={hintId}
      role="note"
      aria-label="Petunjuk pilih bacaan"
      class="absolute left-0 top-full z-30 mt-3 w-[min(16rem,calc(100vw-5rem))] rounded-xl border bg-popover p-4 text-popover-foreground shadow-lg"
    >
      <span
        class="absolute -top-1.5 left-4 size-3 rotate-45 border-l border-t bg-popover"
        aria-hidden="true"
      ></span>
      <p class="text-xs leading-6">
        Ingin langsung ke bacaan tertentu? Tekan tombol daftar ini untuk memilih bacaan.
      </p>
      <Button
        size="sm"
        class="mt-3"
        onclick={() => {
          showHint = false;
        }}
      >
        Mengerti
      </Button>
    </aside>
  {/if}
</div>
