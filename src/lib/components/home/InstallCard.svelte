<script lang="ts">
  import { BookOpen, Download } from '@lucide/svelte';

  import { Button, buttonVariants } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import * as Dialog from '$lib/components/ui/dialog';

  let {
    canInstall,
    installing,
    oninstall,
  }: {
    canInstall: boolean;
    installing: boolean;
    oninstall: () => void;
  } = $props();
</script>

<Card.Root
  class="mt-6 flex-row flex-wrap items-center gap-4 border p-5 shadow-none ring-0 md:mt-8 md:px-6 md:py-5.5"
>
  <div class="grid size-12 shrink-0 place-items-center rounded-xl bg-secondary">
    <BookOpen class="size-6" strokeWidth={1.5} />
  </div>

  <div class="min-w-40 flex-1">
    <h3 class="mb-1 text-xs font-medium leading-6 md:text-[13px]">
      Selalu dekat, di mana pun Anda.
    </h3>
    <p class="text-[11px] leading-6 text-muted-foreground">
      Simpan Dawam di perangkat Anda. Baca kapan saja, bahkan tanpa internet.
    </p>
  </div>

  {#if canInstall}
    <Button
      variant="outline"
      onclick={oninstall}
      disabled={installing}
      class="w-full text-xs shadow-none md:w-auto"
    >
      <Download class="size-4" />{installing ? 'Memasang…' : 'Pasang aplikasi'}
    </Button>
  {:else}
    <Dialog.Root>
      <Dialog.Trigger
        class={buttonVariants({
          variant: 'outline',
          class: 'w-full text-xs shadow-none md:w-auto',
        })}
      >
        <Download class="size-4" />Pasang aplikasi
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Bawa Dawam bersama Anda</Dialog.Title>
          <Dialog.Description>
            Tambahkan Dawam ke layar utama untuk akses lebih mudah.
          </Dialog.Description>
        </Dialog.Header>

        <section class="space-y-2">
          <h3 class="text-xs font-semibold uppercase tracking-widest">iPhone / iPad</h3>
          <p class="text-sm leading-7">
            Buka di Safari, ketuk Bagikan, lalu pilih “Tambah ke Layar Utama”.
          </p>
        </section>

        <section class="space-y-2">
          <h3 class="text-xs font-semibold uppercase tracking-widest">Android / desktop</h3>
          <p class="text-sm leading-7">
            Buka menu browser, lalu pilih “Instal aplikasi” atau “Tambahkan ke layar utama” jika
            tersedia.
          </p>
        </section>

        <Dialog.Footer>
          <Dialog.Close class={buttonVariants()}>Mengerti</Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  {/if}
</Card.Root>
