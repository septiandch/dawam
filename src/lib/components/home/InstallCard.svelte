<script lang="ts">
  import { Download } from '@lucide/svelte';

  import { Button, buttonVariants } from '$lib/components/ui/button';
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

<div>
  {#if canInstall}
    <Button
      onclick={oninstall}
      disabled={installing}
      class="h-auto min-h-11 whitespace-normal text-xs"
    >
      <Download class="size-4" />{installing ? 'Memasang…' : 'Pasang aplikasi untuk baca offline'}
    </Button>
  {:else}
    <Dialog.Root>
      <Dialog.Trigger
        class={buttonVariants({
          class: 'h-auto min-h-11 whitespace-normal text-xs',
        })}
      >
        <Download class="size-4" />Pasang aplikasi untuk baca offline
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
</div>
