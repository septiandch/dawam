<script lang="ts">
  import { Info, ExternalLink } from '@lucide/svelte';

  import { Button, buttonVariants } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import { Separator } from '$lib/components/ui/separator';

  import type { ReadingEntry } from '$lib/types/content';

  let { entry }: { entry: ReadingEntry } = $props();

  function virtueSources(sourceIds: string[]) {
    return entry.sources
      .filter((source) => sourceIds.includes(source.id))
      .map((source) => source.label)
      .join(' · ');
  }
</script>

<Dialog.Root>
  <Dialog.Trigger
    class={buttonVariants({ variant: 'ghost', size: 'icon', class: 'rounded-full' })}
    aria-label={'Sumber ' + entry.title}
  >
    <Info class="size-5" />
  </Dialog.Trigger>

  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Tentang Bacaan</Dialog.Title>
      <Dialog.Description>{entry.title}</Dialog.Description>
    </Dialog.Header>

    <section class="space-y-3" aria-label="Sumber">
      <h3 class="text-xs font-semibold uppercase tracking-widest">Sumber</h3>

      {#each entry.sources as source}
        <div class="space-y-1">
          <p class="text-sm leading-7">{source.label}</p>

          {#if source.url}
            <Button
              variant="link"
              href={source.url}
              target="_blank"
              rel="noreferrer"
              class="h-auto min-h-11 justify-start px-0 text-xs"
            >
              Lihat referensi <ExternalLink class="size-3.5" />
            </Button>
          {/if}
        </div>
      {/each}
    </section>

    {#each entry.virtues as virtue}
      <Separator />
      <section class="space-y-3" aria-label="Keutamaan">
        <h3 class="text-xs font-semibold uppercase tracking-widest">Keutamaan</h3>
        <p class="text-sm leading-7">{virtue.text}</p>
        <p class="text-xs leading-6 text-muted-foreground">{virtueSources(virtue.sourceIds)}</p>
      </section>
    {/each}

    {#if entry.notes}
      <p class="text-sm leading-7 text-muted-foreground">{entry.notes}</p>
    {/if}
  </Dialog.Content>
</Dialog.Root>
