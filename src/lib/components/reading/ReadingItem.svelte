<script lang="ts">
  import { Repeat2 } from '@lucide/svelte';

  import ArabicText from './ArabicText.svelte';
  import SourceDialog from './SourceDialog.svelte';
  import { Badge } from '$lib/components/ui/badge';

  import { preferences } from '$lib/preferences.svelte';
  import type { ReadingEntry } from '$lib/types/content';

  let { entry, index }: { entry: ReadingEntry; index: number } = $props();

  const arabicSizes: Record<string, string> = {
    sm: 'text-[26px]',
    md: 'text-[30px] md:text-[32px]',
    lg: 'text-[37px] md:text-[40px]',
  };
</script>

<article id={entry.slug} aria-labelledby={entry.id + '-title'}>
  <div class="flex items-center gap-3">
    <Badge variant="secondary" class="size-8 shrink-0 justify-center rounded-full p-0 text-[11px]">
      {String(index + 1).padStart(2, '0')}
    </Badge>

    <h2 id={entry.id + '-title'} class="flex-1 text-xs font-medium leading-relaxed md:text-sm">
      {entry.title}
    </h2>

    {#if entry.sources.length}
      <SourceDialog {entry} />
    {/if}
  </div>

  <p
    class="my-7 font-arabic leading-[2.2] text-foreground [overflow-wrap:anywhere] {arabicSizes[
      preferences.arabicFontScale
    ] ?? arabicSizes.md}"
    lang="ar"
    dir="rtl"
  >
    <ArabicText text={entry.arabic} />
  </p>

  {#if entry.repetitions}
    <Badge
      variant="secondary"
      class="w-fit gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-normal"
    >
      <Repeat2 class="size-3.5" /> Dibaca {entry.repetitions}×
    </Badge>
  {/if}

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
        {entry.transliteration}
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
        {entry.translation}
      </p>
    </section>
  {/if}
</article>
