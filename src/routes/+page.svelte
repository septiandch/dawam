<script lang="ts">
  import { onMount } from 'svelte';
  import { Sun, BookOpen, WifiOff, Heart, Check, RefreshCw } from '@lucide/svelte';

  import AppFooter from '$lib/components/AppFooter.svelte';
  import Settings from '$lib/components/Settings.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import CategoryCard from '$lib/components/home/CategoryCard.svelte';
  import HadithHero from '$lib/components/home/HadithHero.svelte';
  import InstallCard from '$lib/components/home/InstallCard.svelte';
  import { Button } from '$lib/components/ui/button';

  import categories from '$lib/content/categories.json';
  import { hadiths } from '$lib/content/hadiths';
  import { dailyIndex } from '$lib/utils/daily.mjs';

  interface InstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  }

  let today = $state(new Date());
  let ready = $state(false);

  let offlineReady = $state(false);
  let update = $state<ServiceWorker | null>(null);

  let installEvent = $state<InstallPromptEvent | null>(null);
  let installing = $state(false);
  let installed = $state(false);

  const installationKey = 'dawam-installed';

  const hadith = $derived(hadiths[dailyIndex(today, hadiths.length)]);

  const dateLabel = $derived(
    today.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  );

  function captureInstallPrompt(event: Event) {
    event.preventDefault();
    setInstalled(false);
    installEvent = event as InstallPromptEvent;
  }

  function setInstalled(value: boolean) {
    installed = value;

    if (value) installEvent = null;

    try {
      if (value) localStorage.setItem(installationKey, 'true');
      else localStorage.removeItem(installationKey);
    } catch {
      // Installation visibility still works when storage is unavailable.
    }
  }

  function markInstalled() {
    setInstalled(true);
  }

  function trackServiceWorker(registration: ServiceWorkerRegistration) {
    offlineReady = !!registration.active;
    update = registration.waiting;

    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;

      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) {
          update = registration.waiting;
        }
      });
    });
  }

  async function install() {
    const promptEvent = installEvent;

    if (!promptEvent) {
      return;
    }

    installing = true;

    try {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;

      if (choice.outcome === 'accepted') markInstalled();
      installEvent = null;
    } finally {
      installing = false;
    }
  }

  function applyUpdate() {
    navigator.serviceWorker.addEventListener('controllerchange', () => location.reload(), {
      once: true,
    });

    update?.postMessage('SKIP_WAITING');
  }

  onMount(() => {
    const standalone = window.matchMedia('(display-mode: standalone), (display-mode: minimal-ui)');
    const iosNavigator = navigator as Navigator & { standalone?: boolean };

    function checkDisplayMode() {
      if (standalone.matches || iosNavigator.standalone === true) markInstalled();
    }

    try {
      installed = localStorage.getItem(installationKey) === 'true';
    } catch {
      // Fall back to the current display mode.
    }

    checkDisplayMode();
    ready = true;

    standalone.addEventListener('change', checkDisplayMode);
    window.addEventListener('appinstalled', markInstalled);

    const timer = setInterval(() => (today = new Date()), 30000);

    window.addEventListener('beforeinstallprompt', captureInstallPrompt);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(trackServiceWorker);
    }

    return () => {
      clearInterval(timer);
      standalone.removeEventListener('change', checkDisplayMode);
      window.removeEventListener('appinstalled', markInstalled);
      window.removeEventListener('beforeinstallprompt', captureInstallPrompt);
    };
  });
</script>

<svelte:head>
  <title>Dawam — Dzikir Pagi dan Petang</title>
  <meta
    name="description"
    content="Luangkan waktu untuk mengingat-Nya. Baca dzikir pagi dan petang, lengkap dengan Arab, Latin, arti, dan referensi. Tersedia offline."
  />
  <meta property="og:title" content="Dawam — Dzikir Pagi dan Petang" />
  <meta property="og:description" content="Teman tenang untuk dzikir harian Anda." />
</svelte:head>

<header
  class="mx-auto flex h-20.5 max-w-280 items-center justify-between border-b px-5.5 md:h-27 md:px-9"
>
  <a
    href="/"
    class="flex items-center gap-2.5 text-[30px] font-semibold tracking-[-2px] md:text-[35px]"
    aria-label="Dawam beranda"
  >
    <span
      class="text-4xl font-normal leading-none text-primary md:text-[43px] tracking-tight"
      aria-hidden="true"
    >
      ✳
    </span>

    <span>
      dawam
      <span class="text-gold -ml-1">.</span>
    </span>
  </a>
  <div class="flex items-center gap-7">
    <span class="hidden text-[10px] tracking-[0.17em] text-muted-foreground md:inline">
      SEJENAK UNTUK MENGINGAT-NYA
    </span>
    <div class="flex items-center gap-2">
      <ThemeToggle />
      <Settings />
    </div>
  </div>
</header>

<main id="main" class="mx-auto max-w-280 px-5.5 pt-8 md:px-9 md:pt-13">
  <div class="mb-6 md:mb-8.5 md:flex md:items-end md:justify-between md:gap-5">
    <div>
      <p
        class="text-[8px] font-semibold tracking-[0.18em] text-secondary-foreground md:text-[10px]"
      >
        RUANG TENANG, SETIAP HARI
      </p>
      <h1
        class="mb-4 mt-3.5 font-serif text-[37px] font-normal leading-tight tracking-[-0.04em] md:text-[45px]"
      >
        Dekatkan hati.
        <br />
        Tenangkan langkah.
      </h1>
      <p class="text-xs leading-7 text-muted-foreground md:text-sm">
        Temani pagi dan petang dengan mengingat Allah.
      </p>
    </div>
    <div
      class="mt-5 flex items-center gap-2.5 whitespace-nowrap pb-1 text-[10px] text-muted-foreground md:mt-0 md:text-[11px]"
    >
      <Sun class="size-5 text-gold" />
      <span>{ready ? dateLabel : 'Assalamu’alaikum'}</span>
    </div>
  </div>

  <HadithHero {hadith} />

  <section class="mt-8.5 md:mt-12" aria-labelledby="daily-heading">
    <div class="mb-5 flex items-end justify-between md:mb-6">
      <div>
        <p
          class="text-[8px] font-semibold tracking-[0.18em] text-secondary-foreground md:text-[10px]"
        >
          KEBIASAAN KECIL, KEBAIKAN BERARTI
        </p>
        <h2
          id="daily-heading"
          class="mt-2.5 font-serif text-[26px] font-normal tracking-tight md:text-[29px]"
        >
          Dzikir harian
        </h2>
      </div>
      <span class="hidden pb-1 text-xs text-muted-foreground md:inline">
        Mulai dari waktu Anda hari ini.
      </span>
    </div>

    <div class="grid gap-4 md:grid-cols-2 md:gap-5.5">
      {#each categories as category (category.id)}
        <CategoryCard {category} />
      {/each}
    </div>
  </section>

  {#if ready && !installed}
    <InstallCard canInstall={!!installEvent} {installing} oninstall={install} />
  {/if}

  {#if update}
    <div class="mt-4 text-center">
      <Button
        variant="secondary"
        onclick={applyUpdate}
        class="h-auto min-h-11 whitespace-normal text-xs"
      >
        <RefreshCw class="size-4" /> Versi baru tersedia. Perbarui aplikasi
      </Button>
    </div>
  {/if}

  <div
    class="my-6 flex flex-wrap justify-center gap-4 text-[9px] text-secondary-foreground md:mb-4 md:mt-7 md:gap-8 md:text-[10px]"
  >
    <span class="flex items-center gap-1.5">
      <BookOpen class="size-3.5" /> Referensi setiap bacaan
    </span>
    <span class="flex items-center gap-1.5">
      {#if offlineReady}
        <Check class="size-3.5" /> Siap dibaca offline
      {:else}
        <WifiOff class="size-3.5" /> Mendukung baca offline
      {/if}
    </span>
    <span class="flex basis-full items-center justify-center gap-1.5 md:basis-auto">
      <Heart class="size-3.5" /> Tanpa iklan, tanpa akun
    </span>
  </div>
</main>

<AppFooter />
