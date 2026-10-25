<script lang="ts">
  import { onMount, tick, type Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
  let anchor: HTMLDivElement;
  let floating = $state(false);
  let animation: Animation | undefined;

  async function setFloating(next: boolean) {
    if (next === floating) return;
    const button = anchor.querySelector('button');
    const before = button?.getBoundingClientRect();
    animation?.cancel();
    floating = next;
    await tick();

    if (!button || !before || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const after = button.getBoundingClientRect();
    if (!after.width || !after.height) return;
    animation = button.animate(
      [
        {
          transformOrigin: 'top left',
          transform: `translate(${before.left - after.left}px, ${before.top - after.top}px) scale(${before.width / after.width}, ${before.height / after.height})`,
        },
        { transformOrigin: 'top left', transform: 'none' },
      ],
      { duration: 300, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    );
  }

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Float only while the original position is still below the viewport.
        void setFloating(
          entry.boundingClientRect.bottom > (entry.rootBounds?.bottom ?? innerHeight),
        );
      },
      { threshold: [0, 1], rootMargin: '0px 0px -16px 0px' },
    );
    observer.observe(anchor);
    return () => {
      observer.disconnect();
      animation?.cancel();
    };
  });
</script>

<div bind:this={anchor} class="mt-8 min-h-11 text-center" data-floating={floating}>
  <div
    class={floating
      ? 'fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 mx-auto max-w-192 [&_button]:w-full [&_button]:shadow-lg'
      : ''}
  >
    {@render children()}
  </div>
</div>
