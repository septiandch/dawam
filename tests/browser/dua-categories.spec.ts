import { test, expect } from '@playwright/test';

test('travel menu opens the safar reading and its primary reference', async ({ page }) => {
  await page.goto('/read/travel-duas/');
  await expect(page.getByRole('banner')).toContainText("Do'a saat perjalanan");
  await page.getByRole('link', { name: 'Doa Safar', exact: true }).click();
  await expect(page.locator('article h2')).toHaveText('Doa Safar');
  await expect(page.getByRole('link', { name: 'Lihat referensi' }).first()).toHaveAttribute(
    'href',
    'https://sunnah.com/muslim:1342',
  );
});

test('old daily worship links redirect to their new category', async ({ page }) => {
  for (const slug of ['doa-masuk-masjid', 'doa-keluar-masjid', 'doa-setelah-adzan']) {
    await page.goto(`/read/daily-duas/${slug}/`);
    await expect(page).toHaveURL(`/read/worship-duas/${slug}/`);
    await expect(page.locator('article h2')).toBeVisible();
  }
});

test('travel takbir uses the ascent context', async ({ page }) => {
  await page.goto('/read/travel-duas/dzikir-takbir/');
  await expect(page.locator('article h2')).toHaveText('Takbir Saat Menanjak');
  await expect(page.getByText('Dibaca 33x.', { exact: true })).toHaveCount(0);
});
