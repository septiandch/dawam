<script lang="ts">
  import { page } from '$app/state';

  import { Button } from '$lib/components/ui/button';
</script>

<main id="main" class="mx-auto my-[15vh] max-w-175 px-6">
  <span class="text-[10px] font-semibold tracking-[0.18em] text-secondary-foreground">DAWAM</span>
  <h1 class="mb-4 mt-5 font-serif text-[38px] font-normal">
    {page.status === 404 ? 'Bacaan tidak ditemukan' : 'Terjadi kesalahan'}
  </h1>
  <p class="text-sm leading-7 text-muted-foreground">
    Silakan kembali untuk memilih koleksi dzikir.
  </p>
  <Button href="/" class="mt-5">Kembali ke beranda</Button>
</main>
