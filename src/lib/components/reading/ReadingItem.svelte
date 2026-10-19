<script lang="ts">
  import { onMount } from 'svelte';
  import * as Select from '$lib/components/ui/select';

  import { Repeat2 } from '@lucide/svelte';

  import ArabicText from './ArabicText.svelte';
  import ReadingSources from './ReadingSources.svelte';
  import { Badge } from '$lib/components/ui/badge';

  import { preferences } from '$lib/preferences.svelte';
  import type { ReadingEntry } from '$lib/types/content';

  let { entry, index }: { entry: ReadingEntry; index: number } = $props();

  let mounted = $state(false);
  let selection = $state({ entryId: '', versionId: 'default' });
  const versionSelectId = $props.id();
  const variants = $derived(entry.variants ?? []);
  const selectedVersion = $derived(
    selection.entryId === entry.id ? selection.versionId : 'default',
  );
  const variant = $derived(variants.find((version) => version.id === selectedVersion));
  const content = $derived(variant ?? entry);
  const displayedEntry: ReadingEntry = $derived({
    ...entry,
    ...content,
    id: entry.id,
    repetitions: content.repetitions,
    notes: content.notes,
    readingInstruction: content.readingInstruction,
  });
  const selectedLabel = $derived(variant?.label ?? entry.defaultVersionLabel ?? 'Versi utama');
  const readingInstruction = $derived(content.readingInstruction);

  onMount(() => {
    mounted = true;
  });

  $effect(() => {
    if (!mounted) return;
    let versionId = 'default';
    try {
      const saved = localStorage.getItem('dawam-reading-version-' + entry.id);
      if (variants.some((version) => version.id === saved)) versionId = saved!;
    } catch {
      // Storage is optional; changing versions still works for the current card.
    }
    selection = { entryId: entry.id, versionId };
  });

  function selectVersion(versionId: string) {
    if (versionId !== 'default' && !variants.some((version) => version.id === versionId)) return;
    selection = { entryId: entry.id, versionId };
    try {
      localStorage.setItem('dawam-reading-version-' + entry.id, versionId);
    } catch {
      // Keep the in-memory selection when persistence is unavailable.
    }
  }

  const arabicSizes: Record<string, string> = {
    sm: 'text-[26px]',
    md: 'text-[30px] md:text-[32px]',
    lg: 'text-[37px] md:text-[40px]',
  };
</script>

<article id={entry.slug} aria-labelledby={entry.id + '-title'}>
  <div class="flex items-start gap-3">
    <Badge variant="secondary" class="size-8 shrink-0 justify-center rounded-full p-0 text-[11px]">
      {String(index + 1).padStart(2, '0')}
    </Badge>

    <div class="min-w-0 flex-1">
      <h2 id={entry.id + '-title'} class="text-xs font-medium leading-relaxed md:text-sm">
        {entry.title}
      </h2>

      {#if content.repetitions || readingInstruction}
        <div class="mt-2 space-y-1 text-[11px] leading-5 text-muted-foreground">
          {#if content.repetitions && !readingInstruction}
            <p class="flex items-start gap-1.5">
              <Repeat2 class="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              <span>Dibaca {content.repetitions}×</span>
            </p>
          {/if}
          {#if readingInstruction}
            <p class="flex items-start gap-1.5">
              <Repeat2 class="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              <span class="[overflow-wrap:anywhere]">{readingInstruction}</span>
            </p>
          {/if}
        </div>
      {/if}
    </div>
  </div>

  {#if variants.length}
    <div class="mt-6 grid min-w-0 gap-2 border-t border-border/60 pt-4">
      <label
        id={versionSelectId + '-label'}
        for={versionSelectId}
        class="text-xs font-medium text-secondary-foreground"
      >
        Pilih salah satu, tidak perlu digabung
      </label>
      <Select.Root type="single" value={variant?.id ?? 'default'} onValueChange={selectVersion}>
        <Select.Trigger
          id={versionSelectId}
          aria-labelledby={versionSelectId + '-label'}
          class="h-auto min-h-11 w-full min-w-0 whitespace-normal text-left text-xs"
        >
          <span class="min-w-0 [overflow-wrap:anywhere]">{selectedLabel}</span>
        </Select.Trigger>
        <Select.Content
          class="w-(--bits-select-anchor-width) max-w-[calc(100vw-2rem)] [&_[data-slot=select-item]>span:last-child]:min-w-0 [&_[data-slot=select-item]>span:last-child]:shrink [&_[data-slot=select-item]>span:last-child]:whitespace-normal [&_[data-slot=select-item]>span:last-child]:[overflow-wrap:anywhere]"
        >
          <Select.Item value="default" label={entry.defaultVersionLabel ?? 'Versi utama'}>
            {entry.defaultVersionLabel ?? 'Versi utama'}
          </Select.Item>
          {#each variants as version (version.id)}
            <Select.Item value={version.id} label={version.label}>{version.label}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </div>
  {/if}

  <p
    class="my-7 font-arabic leading-[2.2] text-foreground [overflow-wrap:anywhere] {arabicSizes[
      preferences.arabicFontScale
    ] ?? arabicSizes.md}"
    lang="ar"
    dir="rtl"
  >
    <ArabicText text={content.arabic} />
  </p>

  {#if preferences.showTransliteration}
    <section class="mt-6" aria-label="Latin">
      <h3
        class="mb-2 text-[10px] font-semibold uppercase tracking-widest text-secondary-foreground"
      >
        Latin
      </h3>
      <p
        class="text-[13px] italic leading-[1.9] text-secondary-foreground [overflow-wrap:anywhere] md:text-sm"
      >
        {content.transliteration}
      </p>
    </section>
  {/if}

  {#if preferences.showTranslation}
    <section class="mt-6" aria-label="Arti">
      <h3
        class="mb-2 text-[10px] font-semibold uppercase tracking-widest text-secondary-foreground"
      >
        Arti
      </h3>
      <p
        class="text-[13px] leading-[1.9] text-muted-foreground [overflow-wrap:anywhere] md:text-sm"
      >
        {content.translation}
      </p>
    </section>
  {/if}

  <ReadingSources entry={displayedEntry} />
</article>
