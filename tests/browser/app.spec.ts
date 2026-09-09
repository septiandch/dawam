import { test, expect } from '@playwright/test';

test('home, ordered reading, accessible dialog, and persisted preferences', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Dzikir harian' })).toBeVisible();
  await page.getByRole('link', { name: /MENYAMBUT HARI/ }).click();
  await expect(page).toHaveURL(/read\/morning\//);
  await expect(page.getByRole('status')).toHaveText('Pembuka');
  await expect(page.locator('article')).toHaveCount(0);
  await page.getByRole('button', { name: 'Berikutnya' }).click();
  await expect(page.locator('article')).toHaveCount(1);
  await expect(page.locator('article').first()).toContainText('Ayat al-Kursi');
  await expect(page.locator('p[lang="ar"]').first()).toHaveAttribute('dir', 'rtl');
  await expect(
    page.getByRole('region', { name: 'Dalil', exact: true }).locator('blockquote'),
  ).toContainText('QS. Al-Baqarah (2): 255');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Pengaturan bacaan' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.screenshot({ path: 'test-results/settings-desktop.png', animations: 'disabled' });
  await page.getByRole('switch', { name: 'Tampilkan Latin' }).uncheck();
  await page.getByRole('button', { name: 'Ukuran tulisan Arab' }).click();
  await page.getByRole('option', { name: 'Besar', exact: true }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('region', { name: 'Latin', exact: true })).toHaveCount(0);
  await page.reload();
  await page.getByRole('button', { name: 'Berikutnya' }).click();
  await expect(page.getByRole('region', { name: 'Latin', exact: true })).toHaveCount(0);
  await expect(page.locator('p[lang="ar"]').first()).toHaveCSS('font-size', '40px');
  await page.screenshot({ path: 'test-results/reader-desktop.png' });
});

test('mobile layout does not overflow and dialog traps focus', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/home-mobile.png', fullPage: true });
  await page.getByRole('link', { name: /MENUTUP HARI/ }).click();
  await page.screenshot({ path: 'test-results/reader-opening-mobile.png' });
  await page.getByRole('button', { name: 'Berikutnya' }).click();
  await page.screenshot({ path: 'test-results/reader-card-mobile.png' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Pengaturan bacaan' }).click();
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'))).toBe(
      true,
    );
  }
});

test('both collections and fonts available offline after home load', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller)
      await new Promise<void>((resolve) =>
        navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), {
          once: true,
        }),
      );
  });
  await context.setOffline(true);
  for (const category of ['morning', 'evening']) {
    await page.goto(`/read/${category}/`);
    await expect(page.getByRole('status')).toHaveText('Pembuka');
    await page.getByRole('button', { name: 'Berikutnya' }).click();
    await expect(page.locator('article')).toHaveCount(1);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.fonts.check('32px Amiri'))).toBe(true);
  }
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Dzikir harian' })).toBeVisible();
});

test('desktop capture and unknown category', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'test-results/home-desktop.png', fullPage: true });
  const response = await page.goto('/read/unknown/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Bacaan tidak ditemukan' })).toBeVisible();
});

test('installation guidance uses an accessible dialog', async ({ page }) => {
  await page.addInitScript(() => {
    window.addEventListener('beforeinstallprompt', (event) => event.stopImmediatePropagation());
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Pasang aplikasi' }).click();
  await expect(page.getByRole('dialog')).toContainText('Bawa Dawam bersama Anda');
  await expect(page.getByRole('dialog')).toContainText('iPhone / iPad');
  await page.getByRole('button', { name: 'Mengerti', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('reader progresses through every card and supports returning to previous cards', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/read/morning/');

  const next = page.getByRole('button', { name: 'Berikutnya' });
  const previous = page.getByRole('button', { name: 'Sebelumnya' });
  const position = page.getByRole('status');

  await expect(position).toHaveText('Pembuka');
  await expect(previous).toBeDisabled();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await next.click();
  await expect(position).toHaveText('1 dari 19');
  await expect(page.locator('article')).toHaveCount(1);
  const firstTitle = await page.locator('article h2').innerText();

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(next).toBeInViewport();
  await next.click();
  await expect(position).toHaveText('2 dari 19');
  expect(await page.evaluate(() => window.scrollY)).toBeLessThan(100);
  await expect(page.getByRole('region', { name: 'Bacaan 2 dari 19', exact: true })).toBeFocused();

  await previous.click();
  await expect(page.locator('article h2')).toHaveText(firstTitle);

  const titles = new Set<string>([firstTitle]);

  for (let card = 3; card <= 20; card++) {
    await next.click();
    await expect(position).toHaveText(`${card - 1} dari 19`);
    await expect(page.locator('article')).toHaveCount(1);
    titles.add(await page.locator('article h2').innerText());

    if (card <= 5) {
      const arabicText = page.locator('p[lang="ar"]');
      const markers = arabicText.getByRole('img');

      await expect(markers).toHaveText(['١', '٢', '٣', '٤', '٥', '٦'].slice(0, card + 1));
      await expect(arabicText).not.toContainText(/\(\d+\)/);

      if (card === 3) {
        await page.screenshot({ path: 'test-results/reader-ayah-markers-mobile.png' });
      }
    }

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }

  expect(titles.size).toBe(19);

  await next.click();
  await expect(position).toHaveText('Penutup');
  await expect(next).toBeDisabled();
  await expect(page.locator('article')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Alhamdulillah.' })).toBeVisible();
  await page.screenshot({ path: 'test-results/reader-closing-mobile.png' });

  await previous.click();
  await expect(position).toHaveText('19 dari 19');
  await expect(page.locator('article')).toHaveCount(1);

  await next.click();
  await page.getByRole('main').getByRole('link', { name: 'Kembali ke beranda' }).click();
  await expect(page).toHaveURL('/');
  await page.getByRole('link', { name: /MENUTUP HARI/ }).click();
  await expect(position).toHaveText('Pembuka');
  await expect(previous).toBeDisabled();
});

test('install section stays hidden after installation and returns when installation is available again', async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.addEventListener('beforeinstallprompt', (event) => {
      if (event.isTrusted) event.stopImmediatePropagation();
    });
  });
  await page.goto('/');

  const installButton = page.getByRole('button', { name: 'Pasang aplikasi' });
  const installHeading = page.getByRole('heading', { name: 'Selalu dekat, di mana pun Anda.' });

  await expect(installButton).toBeVisible();
  await page.evaluate(() => window.dispatchEvent(new Event('appinstalled')));
  await expect(installHeading).toHaveCount(0);
  await expect(installButton).toHaveCount(0);

  await page.reload();
  await expect(page.getByRole('heading', { name: 'Dzikir harian' })).toBeVisible();
  await expect(installHeading).toHaveCount(0);

  await page.evaluate(() => {
    const promptEvent = Object.assign(new Event('beforeinstallprompt'), {
      prompt: async () => {},
      userChoice: Promise.resolve({ outcome: 'dismissed', platform: 'web' }),
    });
    window.dispatchEvent(promptEvent);
  });
  await expect(installButton).toBeVisible();
  await installButton.click();
  await expect(installHeading).toBeVisible();
});

for (const mode of ['standalone', 'ios'] as const) {
  test(`install section is hidden in ${mode} app mode`, async ({ page }) => {
    await page.addInitScript((mode) => {
      window.addEventListener('beforeinstallprompt', (event) => event.stopImmediatePropagation());

      if (mode === 'ios') {
        Object.defineProperty(navigator, 'standalone', { value: true });
      } else {
        const originalMatchMedia = window.matchMedia.bind(window);
        window.matchMedia = (query) => {
          const result = originalMatchMedia(query);
          if (query.includes('display-mode: standalone')) {
            Object.defineProperty(result, 'matches', { value: true });
          }
          return result;
        };
      }
    }, mode);

    await page.goto('/');
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem('dawam-installed')))
      .toBe('true');
    await expect(
      page.getByRole('heading', { name: 'Selalu dekat, di mana pun Anda.' }),
    ).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Pasang aplikasi' })).toHaveCount(0);
  });
}

test('theme follows system initially and persists an explicit choice across pages and reloads', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Mode gelap', exact: true });
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('html')).toHaveClass('dark');
  await toggle.click();
  await expect(page.locator('html')).not.toHaveClass('dark');
  await page.reload();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('html')).not.toHaveClass('dark');
  await page.getByRole('link', { name: /MENYAMBUT HARI/ }).click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await toggle.click();
  await page.reload();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('html')).toHaveClass('dark');
});
