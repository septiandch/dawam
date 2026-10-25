<script lang="ts">
  import AyahMarker from './AyahMarker.svelte';

  let { text }: { text: string } = $props();

  // Use explicit verse markers to separate verses without changing the source content.
  const verses = $derived(
    text
      .split(/(?<=\(\d+\))\s*/u)
      .filter((verse) => verse.trim())
      .map((verse) =>
        verse.split(/(\(\d+\))/g).map((text) => ({
          text,
          ayahNumber: /^\((\d+)\)$/.exec(text)?.[1],
        })),
      ),
  );
</script>

{#each verses as segments}
  <span class={verses.length > 1 ? 'block' : undefined}>
    {#each segments as segment}
      {#if segment.ayahNumber}
        <AyahMarker number={segment.ayahNumber} />
      {:else}
        {segment.text}
      {/if}
    {/each}
  </span>
{/each}
