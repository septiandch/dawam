import { test, expect } from '@playwright/test';
import { reading, categories } from '../helpers/content.mjs';

for (const [slug, title, source] of [
  ['doa-sebelum-makan', 'Doa Sebelum Makan', 'https://sunnah.com/bukhari:5376'],
  ['doa-setelah-makan', 'Doa Setelah Makan', 'https://sunnah.com/tirmidhi:3458'],
  ['doa-masuk-masjid', 'Doa Masuk Masjid', 'https://sunnah.com/muslim:713a'],
  ['doa-keluar-masjid', 'Doa Keluar Masjid', 'https://sunnah.com/muslim:713a'],
  ['doa-setelah-adzan', 'Doa Setelah Adzan', 'https://sunnah.com/bukhari:614'],
  ['doa-keluar-rumah', 'Doa Keluar Rumah', 'https://sunnah.com/hisn:16'],
]) {
  test(`daily duas opens ${slug} from the renamed catalog`, async ({ page }) => {
    const category = categories.find(
      (c) => c.kind === 'dua' && c.items.some((i) => i.entryId === reading(slug).id),
    )!;
    await page.goto(`/read/${category.slug}/`);
    await expect(page.getByRole('banner')).toContainText(category.title);
    const link = page.getByRole('link', { name: title, exact: true });
    await expect(link).toHaveAttribute('href', `/read/${category.slug}/${slug}/`);
    await link.click();
    await expect(page.locator('article h2')).toHaveText(title);
    const entry = reading(slug);
    const virtues = page.getByRole('region', { name: 'Keutamaan', exact: true });
    if (entry.virtues.length) {
      await expect(virtues).toBeVisible();
      for (const virtue of entry.virtues) await expect(virtues).toContainText(virtue.text);
    } else {
      await expect(virtues).toHaveCount(0);
    }
    await expect(page.getByRole('link', { name: 'Lihat referensi' }).first()).toHaveAttribute(
      'href',
      source,
    );
  });
}

test('legacy reading links redirect to the short slug and old start bookmarks still select the reading', async ({
  page,
}) => {
  await page.goto('/read/bedtime/al-ikhlas-9e36/');
  await expect(page).toHaveURL(/\/read\/bedtime\/surah-al-ikhlas\//);
  await expect(page.locator('article h2')).toHaveText('Al-Ikhlas');
  await page.goto('/read/morning/?mode=sequence&start=al-ikhlas-9e36');
  await expect(page.locator('article h2')).toHaveText('Al-Ikhlas');
  await expect(page.getByRole('status')).toHaveText('2 dari 19');
});

test('shared surahs select the category variant in sequence and standalone views', async ({
  page,
}) => {
  await page.goto('/read/bedtime/?mode=single');
  for (const title of ['Al-Ikhlas', 'Al-Falaq', 'An-Naas']) {
    await expect(page.getByRole('link', { name: title, exact: true })).toBeVisible();
  }
  await page.getByRole('link', { name: 'Al-Ikhlas', exact: true }).click();
  await expect(page.locator('article h2')).toHaveText('Al-Ikhlas');
  await expect(page.getByRole('link', { name: 'Lihat referensi' })).toHaveAttribute(
    'href',
    'https://sunnah.com/bukhari:5017',
  );
  await page.goto('/read/bedtime/surah-al-ikhlas/');
  await expect(page.getByRole('link', { name: 'Lihat referensi' })).toHaveAttribute(
    'href',
    'https://sunnah.com/bukhari:5017',
  );
  await page.goto('/read/morning/surah-al-ikhlas/');
  await expect(page.getByRole('link', { name: 'Lihat referensi' })).toHaveAttribute(
    'href',
    'https://sunnah.com/abudawud:5082',
  );
});

test('bedtime and post-prayer takbir retain separate counts without exposing context variants in the picker', async ({
  page,
}) => {
  await page.goto('/read/bedtime/dzikir-takbir/');
  await expect(page.locator('article h2')).toHaveText('Takbir Sebelum Tidur');
  await expect(page.getByText('Dibaca 34x.', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Lihat referensi' })).toHaveAttribute(
    'href',
    'https://sunnah.com/bukhari:5361',
  );
  await expect(page.getByRole('combobox')).toHaveCount(0);
  await page.goto('/read/post-prayer/dzikir-takbir/');
  await expect(page.locator('article h2')).toHaveText('Takbir Setelah Shalat');
  await expect(page.getByText('Dibaca 33x.', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Lihat referensi' })).toHaveAttribute(
    'href',
    'https://sunnah.com/muslim:597a',
  );
});
