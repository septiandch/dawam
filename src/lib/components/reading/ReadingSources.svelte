<script lang="ts">
  import { ExternalLink } from '@lucide/svelte';
  import type { ReadingEntry } from '$lib/types/content';
  let { entry }: { entry: ReadingEntry } = $props();
  const visibleSources = $derived(entry.sources.filter((source) => source.type !== 'quran'));
  const notes = $derived(entry.notes);
</script>

{#if entry.virtues.length || visibleSources.length || notes}
  <div
    class="mt-7 divide-y divide-border/60 rounded-xl bg-muted/40 px-4 text-[13px] leading-7 text-muted-foreground md:px-5"
  >
    {#if entry.virtues.length}
      <section aria-label="Keutamaan" class="py-4">
        <h3
          class="mb-2 text-[10px] font-semibold uppercase tracking-widest text-secondary-foreground"
        >
          Keutamaan
        </h3>
        <div class="space-y-3">
          {#each entry.virtues as virtue}
            <blockquote>
              <p class="[overflow-wrap:anywhere]">
                {virtue.text}
                {#if visibleSources.length > 1}
                  {#each visibleSources as source, sourceIndex}
                    {#if virtue.sourceIds.includes(source.id)}
                      <a
                        href={'#' + entry.id + '-reference-' + source.id}
                        aria-label={'Lihat dalil ' + (sourceIndex + 1)}
                        class="ml-1 inline-block text-[10px] font-medium text-primary underline underline-offset-2"
                      >
                        [{sourceIndex + 1}]
                      </a>
                    {/if}
                  {/each}
                {/if}
              </p>
            </blockquote>
          {/each}
        </div>
      </section>
    {/if}
    {#if visibleSources.length}
      <section aria-label="Dalil" class="py-4">
        <ul class="space-y-3">
          {#each visibleSources as source, sourceIndex}
            <li id={entry.id + '-reference-' + source.id} class="scroll-mt-4">
              <p
                class="text-xs font-medium leading-6 text-secondary-foreground [overflow-wrap:anywhere]"
              >
                {#if visibleSources.length > 1}
                  <span class="mr-1 text-primary">[{sourceIndex + 1}]</span>
                {/if}
                {source.label}
              </p>
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
            </li>
          {/each}
        </ul>
      </section>
    {/if}
    {#if notes}
      <p class="py-4 text-xs leading-6 [overflow-wrap:anywhere]">{notes}</p>
    {/if}
  </div>
{/if}
