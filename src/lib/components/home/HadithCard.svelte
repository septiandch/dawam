<script lang="ts">
  import { BookOpen, ArrowUpRight } from '@lucide/svelte';

  import * as Card from '$lib/components/ui/card';
  import type { hadiths } from '$lib/content/hadiths';

  let { hadith }: { hadith: (typeof hadiths)[number] } = $props();
</script>

<section aria-labelledby="hadith-heading">
  <div class="relative flex flex-col items-stretch z-10 w-full h-full p-8 text-hero-foreground">
    <div>
      <h2
        id="hadith-heading"
        class="flex items-center gap-2.5 text-[8px] font-normal tracking-[0.2em] text-hero-muted md:text-[10px]"
      >
        <span class="h-px w-5.5 bg-gold-light"></span>
        NASIHAT HARI INI
      </h2>

      <blockquote
        class="my-6 max-w-165 font-serif text-[23px] leading-[1.55] tracking-tight md:text-[27px]"
      >
        “{hadith.text}”
      </blockquote>
    </div>

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
    class="pointer-events-none absolute inset-y-0 right-0 w-[45%] overflow-hidden opacity-25 lg:w-[27%] lg:opacity-75"
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
    <div class="absolute -right-24 -top-41 size-72 rounded-full border border-hero-muted/20"></div>
    <span class="absolute right-28 top-24 text-5xl text-gold-light">✦</span>
    <div class="absolute -right-5 bottom-8 w-58 -rotate-19 border-t border-hero-muted/30"></div>
    <p
      class="absolute bottom-11 right-13 hidden text-[9px] leading-5 tracking-[0.2em] text-hero-muted lg:block"
    >
      HANYA DENGAN MENGINGAT ALLAH
      <br />
      HATI MENJADI TENANG
    </p>
  </div>
</section>
