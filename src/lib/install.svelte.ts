interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const installationKey = 'dawam-installed';

export const install = $state({
  ready: false,
  promptEvent: null as InstallPromptEvent | null,
  installing: false,
  installed: false,
  offlineReady: false,
  update: null as ServiceWorker | null,
});

function setInstalled(value: boolean) {
  install.installed = value;

  if (value) install.promptEvent = null;

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

function captureInstallPrompt(event: Event) {
  event.preventDefault();
  setInstalled(false);
  install.promptEvent = event as InstallPromptEvent;
}

export async function installApp() {
  const promptEvent = install.promptEvent;

  if (!promptEvent) {
    return;
  }

  install.installing = true;

  try {
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;

    if (choice.outcome === 'accepted') markInstalled();
    install.promptEvent = null;
  } finally {
    install.installing = false;
  }
}

function trackServiceWorker(registration: ServiceWorkerRegistration) {
  install.offlineReady = !!registration.active;
  install.update = registration.waiting;

  registration.addEventListener('updatefound', () => {
    const worker = registration.installing;

    worker?.addEventListener('statechange', () => {
      if (worker.state === 'installed' && navigator.serviceWorker.controller) {
        install.update = registration.waiting;
      }
    });
  });
}

export function applyUpdate() {
  navigator.serviceWorker.addEventListener('controllerchange', () => location.reload(), {
    once: true,
  });

  install.update?.postMessage('SKIP_WAITING');
}

/** Wires up install and service worker tracking; call from `onMount` and run the returned cleanup. */
export function initInstall() {
  const standalone = window.matchMedia('(display-mode: standalone), (display-mode: minimal-ui)');
  const iosNavigator = navigator as Navigator & { standalone?: boolean };

  function checkDisplayMode() {
    if (standalone.matches || iosNavigator.standalone === true) markInstalled();
  }

  try {
    install.installed = localStorage.getItem(installationKey) === 'true';
  } catch {
    // Fall back to the current display mode.
  }

  checkDisplayMode();
  install.ready = true;

  standalone.addEventListener('change', checkDisplayMode);
  window.addEventListener('appinstalled', markInstalled);
  window.addEventListener('beforeinstallprompt', captureInstallPrompt);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(trackServiceWorker);
  }

  return () => {
    standalone.removeEventListener('change', checkDisplayMode);
    window.removeEventListener('appinstalled', markInstalled);
    window.removeEventListener('beforeinstallprompt', captureInstallPrompt);
  };
}
