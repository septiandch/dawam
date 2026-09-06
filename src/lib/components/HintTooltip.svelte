<script lang="ts" module>
  const seenHints = new Set<string>();
</script>

<script lang="ts">
  import { onMount, type Snippet } from 'svelte';

  import * as Tooltip from '$lib/components/ui/tooltip';

  let {
    message,
    storageKey,
    disabled = false,
    children,
  }: {
    message: string;
    storageKey: string;
    disabled?: boolean;
    children: Snippet<[{ props: Record<string, unknown> }]>;
  } = $props();

  let open = $state(false);

  onMount(() => {
    if (seenHints.has(storageKey) || disabled) return;

    seenHints.add(storageKey);

    try {
      if (localStorage.getItem(storageKey) === 'true') return;
    } catch {
      // Fall back to remembering the hint for this session.
    }

    open = true;

    try {
      localStorage.setItem(storageKey, 'true');
    } catch {
      // The in-memory set prevents repeated hints when storage is unavailable.
    }
  });

  $effect(() => {
    if (disabled) open = false;
  });
</script>

<Tooltip.Provider delayDuration={300} ignoreNonKeyboardFocus>
  <Tooltip.Root bind:open {disabled}>
    <Tooltip.Trigger>
      {#snippet child({ props })}
        {@render children({ props })}
      {/snippet}
    </Tooltip.Trigger>

    <Tooltip.Content
      side="bottom"
      align="end"
      sideOffset={8}
      collisionPadding={16}
      class="max-w-[min(15rem,calc(100vw-2rem))] rounded-xl px-3.5 py-2.5 text-xs leading-5 shadow-md"
    >
      {message}
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
