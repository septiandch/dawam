<script lang="ts">
  import HadithPopup from '$lib/components/home/HadithPopup.svelte';
  import Settings from '$lib/components/Settings.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
</script>

<header class="mx-auto flex max-w-200 items-center justify-between p-4">
  <a
    href="/"
    class="flex items-center gap-2.5 text-[30px] font-semibold tracking-[-2px] md:text-4xl"
    aria-label="Dawam beranda"
  >
    <img src="/logo.svg" alt="app-logo" class="h-12" />

    <span>
      dawam
      <span class="text-gold -ml-1">.</span>
    </span>
  </a>

  <div class="flex items-center gap-7">
    <div class="flex items-center gap-1.5 md:gap-2">
      <HadithPopup />
      <ThemeToggle />
      <Settings />
    </div>
  </div>
</header>
