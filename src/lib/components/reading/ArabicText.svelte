<script lang="ts">
  import AyahMarker from './AyahMarker.svelte';

  let { text }: { text: string } = $props();

  // Keep the source text intact; only replace explicit parenthesized verse numbers.
  const segments = $derived(
    text.split(/(\(\d+\))/g).map((text) => ({
      text,
      ayahNumber: /^\((\d+)\)$/.exec(text)?.[1],
    })),
  );
</script>

{#each segments as segment}
  {#if segment.ayahNumber}
    <AyahMarker number={segment.ayahNumber} />
  {:else}
    {segment.text}
  {/if}
{/each}
