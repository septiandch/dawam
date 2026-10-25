import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem('dawam-hadith-seen', new Date().toLocaleDateString('en-CA')),
  );
  await page.goto('/');
  const closeAdvice = page.getByRole('button', { name: 'Tutup dialog', exact: true });
  if (await closeAdvice.isVisible()) await closeAdvice.click();
});

test('home search finds a reading and opens it directly', async ({ page }) => {
  const search = page.getByRole('searchbox', { name: 'Cari semua bacaan' });
  await search.fill('doa setelah makan');
  const results = page.getByRole('region', { name: 'Hasil pencarian' });
  const result = results.getByRole('link', {
    name: "Doa Setelah Makan Do'a sehari-hari",
    exact: true,
  });
  await expect(result).toHaveAttribute('href', '/read/daily-duas/doa-setelah-makan/');
  await result.click();
  await expect(page.locator('article h2')).toHaveText('Doa Setelah Makan');
});

test('home search preserves the category of shared readings', async ({ page }) => {
  await page.getByRole('searchbox', { name: 'Cari semua bacaan' }).fill('takbir');
  const result = page
    .getByRole('region', { name: 'Hasil pencarian' })
    .getByRole('link', { name: 'Takbir Sebelum Tidur Dzikir sebelum tidur', exact: true });
  await result.click();
  await expect(page.locator('article h2')).toHaveText('Takbir Sebelum Tidur');
  await expect(page.getByText('Dibaca 34x.', { exact: true })).toBeVisible();
});

test('empty search results and clearing work on smartphone', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  const search = page.getByRole('searchbox', { name: 'Cari semua bacaan' });
  await search.fill('tidak-ada-xyz');
  await expect(page.getByRole('status')).toHaveText('0 bacaan ditemukan');
  await expect(page.getByText('Tidak ada bacaan yang cocok. Coba kata kunci lain.')).toBeVisible();
  await page.getByRole('button', { name: 'Hapus pencarian' }).click();
  await expect(search).toHaveValue('');
  await expect(search).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Dzikir', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
