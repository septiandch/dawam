import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const slugs = [
  'takbiratul-ihram',
  'al-fatihah',
  'tasyahud',
  'shalawat',
  'doa-sebelum-salam',
  'salam',
  'istighfar-setelah-shalat',
  'allahumma-antas-salam',
  'tauhid-setelah-shalat',
  'tasbih-setelah-shalat',
  'tahmid-setelah-shalat',
  'takbir-setelah-shalat',
  'tahlil-penutup-setelah-shalat',
];
for (const slug of slugs) {
  const entry = JSON.parse(
    readFileSync(
      new URL(`../../src/lib/content/entries/shalat-${slug}.json`, import.meta.url),
      'utf8',
    ),
  );
  test(`prayer catalog opens ${slug} in the sequence`, async ({ page }) => {
    const postPrayer = slugs.indexOf(slug) > slugs.indexOf('salam');
    await page.goto(`/read/${postPrayer ? 'post-prayer' : 'prayer'}/?mode=single`);
    await page.getByRole('link', { name: entry.title, exact: true }).click();
    await expect(page.locator('article h2')).toHaveText(entry.title);
    await expect(page.getByRole('navigation', { name: 'Navigasi bacaan' })).toBeVisible();
    if (slug === 'al-fatihah') {
      await expect(page.locator('p[lang="ar"]').getByRole('img')).toHaveText([
        '١',
        '٢',
        '٣',
        '٤',
        '٥',
        '٦',
        '٧',
      ]);
      await expect(page.getByRole('link', { name: 'Lihat referensi' })).toHaveAttribute(
        'href',
        'https://sunnah.com/bukhari:756',
      );
    } else {
      await expect(page.locator('p[lang="ar"]')).toHaveText(entry.arabic);
    }
    if (slug === 'salam') {
      await expect(page.getByRole('status')).toHaveText('13 dari 13');
      await page.getByRole('button', { name: 'Berikutnya', exact: true }).click();
      await expect(page.getByRole('status')).toHaveText('Penutup');
    }
  });
}
