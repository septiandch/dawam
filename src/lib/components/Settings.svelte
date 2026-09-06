<script lang="ts">
  import { Settings2 } from '@lucide/svelte';

  import { buttonVariants } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import { Label } from '$lib/components/ui/label';
  import * as Select from '$lib/components/ui/select';
  import { Separator } from '$lib/components/ui/separator';
  import { Switch } from '$lib/components/ui/switch';

  import { preferences, savePreferences } from '$lib/preferences.svelte';

  const fontSizes = [
    { value: 'sm', label: 'Kecil' },
    { value: 'md', label: 'Sedang' },
    { value: 'lg', label: 'Besar' },
  ];

  const selectedFontLabel = $derived(
    fontSizes.find((size) => size.value === preferences.arabicFontScale)?.label,
  );

  function setTransliteration(checked: boolean) {
    preferences.showTransliteration = checked;
    savePreferences();
  }

  function setTranslation(checked: boolean) {
    preferences.showTranslation = checked;
    savePreferences();
  }

  function setFontSize(value: string) {
    if (!value) return;

    preferences.arabicFontScale = value;
    savePreferences();
  }
</script>

<Dialog.Root>
  <Dialog.Trigger
    class={buttonVariants({
      variant: 'outline',
      size: 'icon',
      class: 'rounded-full bg-transparent shadow-none',
    })}
    aria-label="Pengaturan bacaan"
  >
    <Settings2 class="size-5" />
  </Dialog.Trigger>

  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Pengaturan bacaan</Dialog.Title>
      <Dialog.Description>Sesuaikan tampilan untuk kenyamanan membaca.</Dialog.Description>
    </Dialog.Header>

    <div class="grid gap-5">
      <div class="flex min-h-11 items-center justify-between gap-4">
        <Label for="show-latin">Tampilkan Latin</Label>
        <Switch
          id="show-latin"
          checked={preferences.showTransliteration}
          onCheckedChange={setTransliteration}
        />
      </div>

      <div class="flex min-h-11 items-center justify-between gap-4">
        <Label for="show-translation">Tampilkan arti</Label>
        <Switch
          id="show-translation"
          checked={preferences.showTranslation}
          onCheckedChange={setTranslation}
        />
      </div>

      <Separator />

      <div class="grid gap-3">
        <Label for="font-size">Ukuran tulisan Arab</Label>
        <Select.Root type="single" value={preferences.arabicFontScale} onValueChange={setFontSize}>
          <Select.Trigger id="font-size" class="h-11 w-full">{selectedFontLabel}</Select.Trigger>
          <Select.Content>
            {#each fontSizes as size}
              <Select.Item value={size.value} label={size.label}>{size.label}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>
    </div>
  </Dialog.Content>
</Dialog.Root>
