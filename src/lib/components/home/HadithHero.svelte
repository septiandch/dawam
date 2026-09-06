<script lang="ts">
  import { BookOpen, ArrowUpRight } from '@lucide/svelte';

  import * as Card from '$lib/components/ui/card';
  import type { hadiths } from '$lib/content/hadiths';

  let { hadith }: { hadith: (typeof hadiths)[number] } = $props();
</script>

<section aria-labelledby="hadith-heading">
  <Card.Root
    class="relative min-h-72 overflow-hidden border-0 bg-hero p-0 text-hero-foreground shadow-none ring-0 md:min-h-75"
  >
    <div class="relative z-10 w-full px-6 py-7 md:w-3/4 md:px-10 md:py-9">
      <h2
        id="hadith-heading"
        class="flex items-center gap-2.5 text-[8px] font-normal tracking-[0.2em] text-hero-muted md:text-[10px]"
      >
        <span class="h-px w-5.5 bg-gold-light"></span>
        HADIS HARI INI
      </h2>

      <blockquote
        class="my-6 max-w-165 font-serif text-[23px] leading-[1.55] tracking-tight md:text-[27px]"
      >
        “{hadith.text}”
      </blockquote>

      <div class="flex items-center gap-3">
        <span
          class="grid size-9 shrink-0 place-items-center rounded-full border border-hero-muted/40 text-hero-muted"
        >
          <BookOpen class="size-4" />
        </span>
        <div>
          <a
            href={hadith.url}
            target="_blank"
            rel="noreferrer"
            class="inline-flex min-h-6 items-center gap-1.5 text-[11px] hover:underline"
          >
            {hadith.source}
            <ArrowUpRight class="size-3" />
          </a>
          <p class="mt-1 text-[9px] text-hero-muted md:text-[10px]">{hadith.narrator}</p>
        </div>
      </div>
    </div>

    <div
      class="pointer-events-none absolute inset-y-0 right-0 w-[45%] overflow-hidden opacity-25 md:w-[27%] md:opacity-75"
      aria-hidden="true"
    >
      <div
        class="absolute -right-5 top-12 h-78 w-52 rounded-t-full border border-hero-muted/25"
      ></div>
      <div
        class="absolute -right-1 top-16 h-78 w-45 rounded-t-full border border-hero-muted/25"
      ></div>
      <div
        class="absolute right-2.5 top-20 h-78 w-37.5 rounded-t-full border border-hero-muted/25"
      ></div>
      <div
        class="absolute -right-24 -top-41 size-72 rounded-full border border-hero-muted/20"
      ></div>
      <span class="absolute right-28 top-24 text-5xl text-gold-light">✦</span>
      <div class="absolute -right-5 bottom-8 w-58 -rotate-19 border-t border-hero-muted/30"></div>
      <p
        class="absolute bottom-11 right-13 hidden text-[9px] leading-5 tracking-[0.2em] text-hero-muted md:block"
      >
        INGAT DIA.
        <br />
        TEMUKAN TENANG.
      </p>
    </div>
  </Card.Root>
</section>
