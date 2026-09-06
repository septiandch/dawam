import { test, expect } from '@playwright/test';

test('home, ordered reading, accessible dialog, and persisted preferences', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Dzikir harian' })).toBeVisible();
  await page.getByRole('link', { name: /MENYAMBUT HARI/ }).click();
  await expect(page).toHaveURL(/read\/morning\//);
  await expect(page.locator('article')).toHaveCount(19);
  await expect(page.locator('article').first()).toContainText('Ayat al-Kursi');
  await expect(page.locator('p[lang="ar"]').first()).toHaveAttribute('dir', 'rtl');
  const info = page.getByRole('button', { name: 'Sumber Ayat al-Kursi' });
  await info.click();
  await expect(page.getByRole('dialog')).toContainText('QS. Al-Baqarah (2): 255');
  await page.keyboard.press('Escape');
  await expect(info).toBeFocused();
  await page.getByRole('button', { name: 'Pengaturan bacaan' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.screenshot({ path: 'test-results/settings-desktop.png', animations: 'disabled' });
  await page.getByRole('switch', { name: 'Tampilkan Latin' }).uncheck();
  await page.getByRole('button', { name: 'Ukuran tulisan Arab' }).click();
  await page.getByRole('option', { name: 'Besar', exact: true }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('region', { name: 'Latin', exact: true })).toHaveCount(0);
  await page.reload();
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
    await expect(page.locator('article')).toHaveCount(19);
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
