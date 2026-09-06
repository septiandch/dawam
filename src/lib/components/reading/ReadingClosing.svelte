<script lang="ts">
  import { ArrowLeft, Check } from '@lucide/svelte';

  import { Button } from '$lib/components/ui/button';
</script>

<div class="flex flex-1 flex-col items-center justify-center py-10 text-center md:py-16">
  <Check class="size-6 text-secondary-foreground" />

  <h2 class="mb-2.5 mt-4 font-serif text-2xl font-normal">Alhamdulillah.</h2>

  <p class="text-[13px] leading-7 text-muted-foreground">
    Semoga Allah menerima setiap dzikir kita.
  </p>

  <Button href="/" class="mt-5">
    <ArrowLeft class="size-4" /> Kembali ke beranda
  </Button>
</div>
