<script lang="ts">
  import { Sun, Sunset, Moon, BookOpen, ArrowRight } from '@lucide/svelte';

  import type { Category } from '$lib/types/content';

  let { category }: { category: Category } = $props();

  const icons = { sun: Sun, sunset: Sunset, moon: Moon, 'book-open': BookOpen };
  const Icon = $derived(category.icon === 'prayer-hands' ? undefined : icons[category.icon]);
</script>

<a
  href={'/read/' + category.slug + '/'}
  class="flex min-h-16 items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
>
  {#if category.icon === 'prayer-hands'}
    <svg
      class="size-6 shrink-0 text-primary"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M10 21v-3.5c0-1.5-.5-2.5-1.5-3.5L6 11.5a1.4 1.4 0 0 0-2 2L6 16" />
      <path d="M4 12V5a1.5 1.5 0 0 0-3 0v8c0 2 .8 3.5 2 5l2 3" />
      <path d="M14 21v-3.5c0-1.5.5-2.5 1.5-3.5l2.5-2.5a1.4 1.4 0 0 1 2 2L18 16" />
      <path d="M20 12V5a1.5 1.5 0 0 1 3 0v8c0 2-.8 3.5-2 5l-2 3" />
    </svg>
  {:else if Icon}
    <Icon class="size-6 shrink-0 text-primary" strokeWidth={1.5} aria-hidden="true" />
  {/if}
  <div class="min-w-0 flex-1">
    <h3 class="text-sm font-medium">{category.title}</h3>
    <p class="mt-1 text-sm text-muted-foreground">{category.shortDescription}</p>
  </div>
  <ArrowRight class="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
</a>
