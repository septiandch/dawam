<script lang="ts">
  import { ExternalLink } from '@lucide/svelte';
  import type { ReadingEntry } from '$lib/types/content';
  let { entry }: { entry: ReadingEntry } = $props();
  function virtueSources(sourceIds: string[]) {
    return entry.sources
      .filter((source) => sourceIds.includes(source.id))
      .map((source) => source.label)
      .join(' · ');
  }
</script>

{#if entry.virtues.length || entry.sources.length || entry.notes}
  <div class="mt-7 space-y-5 text-sm leading-7 text-muted-foreground">
    {#if entry.virtues.length}
      <section aria-label="Keutamaan">
        <h3
          class="mb-2 text-[10px] font-semibold uppercase tracking-widest text-secondary-foreground"
        >
          Keutamaan
        </h3>
        <div class="space-y-3">
          {#each entry.virtues as virtue}
            <blockquote class="border-l-2 border-gold/50 pl-4">
              <p>{virtue.text}</p>
              {#if virtue.sourceIds.length}
                <footer class="mt-2 text-xs leading-6">{virtueSources(virtue.sourceIds)}</footer>
              {/if}
            </blockquote>
          {/each}
        </div>
      </section>
    {/if}
    {#if entry.sources.length}
      <section aria-label="Dalil">
        <h3
          class="mb-2 text-[10px] font-semibold uppercase tracking-widest text-secondary-foreground"
        >
          Dalil
        </h3>
        <blockquote class="space-y-3 border-l-2 border-gold/50 pl-4">
          {#each entry.sources as source}
            <div>
              <p>{source.label}</p>
              {#if source.url}
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  class="inline-flex min-h-11 items-center gap-1.5 text-xs text-primary underline underline-offset-4"
                >
                  Lihat referensi <ExternalLink class="size-3.5" />
                </a>
              {/if}
            </div>
          {/each}
        </blockquote>
      </section>
    {/if}
    {#if entry.notes}
      <p class="text-xs leading-6">{entry.notes}</p>
    {/if}
  </div>
{/if}
