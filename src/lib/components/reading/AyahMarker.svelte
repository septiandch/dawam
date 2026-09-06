<script lang="ts">
  let { number }: { number: string } = $props();

  const arabicNumber = $derived(number.replace(/\d/g, (digit) => '٠١٢٣٤٥٦٧٨٩'[Number(digit)]));
</script>

<span
  role="img"
  aria-label={`الآية ${arabicNumber}`}
  class="mx-[0.12em] inline-flex h-[1.3em] min-w-[1.3em] items-center justify-center rounded-full border-[0.09em] border-double border-current px-[0.1em] align-middle leading-none [unicode-bidi:isolate]"
>
  <span aria-hidden="true" dir="ltr" class="pt-[0.15em] text-[0.65em] leading-none">
    {arabicNumber}
  </span>
</span>
