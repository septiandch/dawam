import { test, expect, type Page, type Locator } from '@playwright/test';

import iftitah from '../../src/lib/content/entries/shalat-doa-iftitah.json' with { type: 'json' };
import rukuk from '../../src/lib/content/entries/shalat-tasbih-rukuk.json' with { type: 'json' };
import sujud from '../../src/lib/content/entries/shalat-tasbih-sujud.json' with { type: 'json' };
import tasyahud from '../../src/lib/content/entries/shalat-tasyahud.json' with { type: 'json' };
import antaraSujud from '../../src/lib/content/entries/shalat-doa-antara-dua-sujud.json' with { type: 'json' };
import type { ReadingEntry, ReadingText } from '../../src/lib/types/content';

const entries: ReadingEntry[] = [iftitah, rukuk, sujud, tasyahud, antaraSujud] as ReadingEntry[];
const sequence = '/read/prayer/?mode=sequence&start=shalat-tasbih-rukuk';
const direct = (entry: ReadingEntry) => `/read/prayer/${entry.slug}/`;
const storageKey = (entry: ReadingEntry) => `dawam-reading-version-${entry.id}`;
const picker = (page: Page) =>
  page.getByRole('button', { name: 'Pilih salah satu, tidak perlu digabung', exact: true });

async function select(page: Page, label: string) {
  await picker(page).click();
  await page.getByRole('option', { name: label, exact: true }).click();
  await expect(picker(page)).toHaveText(label);
}

async function expectContent(page: Page, entry: ReadingEntry, content: ReadingText = entry) {
  const article = page.getByRole('article', { name: entry.title, exact: true });
  await expect(article).toBeVisible();
  await expect(article.locator('p[lang="ar"]')).toHaveText(content.arabic);
  await expect(article.getByRole('region', { name: 'Latin', exact: true }).locator('p')).toHaveText(
    content.transliteration,
  );
  await expect(article.getByRole('region', { name: 'Arti', exact: true }).locator('p')).toHaveText(
    content.translation,
  );
  const sources = article.getByRole('region', { name: 'Dalil', exact: true });
  await expect(sources.getByRole('listitem')).toHaveCount(content.sources.length);
  for (const source of content.sources) {
    await expect(sources.getByRole('listitem').filter({ hasText: source.label })).toBeVisible();
    await expect(sources.locator(`a[href="${source.url}"]`)).toBeVisible();
  }
  if (content.notes) await expect(article.getByText(content.notes, { exact: true })).toBeVisible();
  if (content !== entry && content.notes !== entry.notes) {
    await expect(article.getByText(entry.notes!, { exact: true })).toHaveCount(0);
  }
  if (content.repetitions) {
    await expect(
      article.getByText(`Dibaca ${content.repetitions}×`, { exact: true }),
    ).toBeVisible();
  } else {
    await expect(article.getByText(/^Dibaca \d+×$/)).toHaveCount(0);
  }
  await expect(article.getByRole('region', { name: 'Keutamaan', exact: true })).toHaveCount(0);
}

async function expectStored(page: Page, entry: ReadingEntry, value: string) {
  await expect
    .poll(() => page.evaluate((key) => localStorage.getItem(key), storageKey(entry)))
    .toBe(value);
}

async function expectFits(page: Page, locator: Locator) {
  await expect(locator).toBeVisible();
  const bounds = await locator.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

for (const entry of entries) {
  test(`${entry.slug}: switches all content and restores the default`, async ({ page }) => {
    await page.goto(direct(entry));
    await expect(picker(page)).toHaveText(entry.defaultVersionLabel!);
    await expectContent(page, entry);
    await picker(page).click();
    await expect(page.getByRole('option')).toHaveText([
      entry.defaultVersionLabel!,
      ...entry.variants!.map((variant) => variant.label),
    ]);
    await page.keyboard.press('Escape');

    for (const variant of entry.variants!) {
      await select(page, variant.label);
      await expectContent(page, entry, variant);
      await expectStored(page, entry, variant.id);
      await page.reload();
      await expect(picker(page)).toHaveText(variant.label);
      await expectContent(page, entry, variant);
      await select(page, entry.defaultVersionLabel!);
      await expectContent(page, entry);
      await expectStored(page, entry, 'default');
      await page.reload();
      await expect(picker(page)).toHaveText(entry.defaultVersionLabel!);
      await expectContent(page, entry);
    }
  });

  test(`${entry.slug}: open dropdown fits at 320px`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto(direct(entry));
    await expectFits(page, picker(page));
    await picker(page).click();
    await expectFits(page, page.getByRole('listbox'));
    for (const option of await page.getByRole('option').all()) await expectFits(page, option);
    await page.getByRole('option', { name: entry.variants![0].label, exact: true }).click();
    await expectContent(page, entry, entry.variants![0]);
    await expectFits(page, picker(page));
  });
}

test('selections survive previous/next, reload, and direct routes independently', async ({
  page,
}) => {
  await page.goto(sequence);
  await select(page, rukuk.variants[0].label);
  await page.getByRole('button', { name: 'Sebelumnya', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Surah Al-Fatihah', exact: true })).toBeVisible();
  await expect(picker(page)).toHaveCount(0);
  await page.getByRole('button', { name: 'Sebelumnya', exact: true }).click();
  await expect(picker(page)).toHaveText(iftitah.defaultVersionLabel);
  await select(page, iftitah.variants[0].label);
  await page.getByRole('button', { name: 'Berikutnya', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Surah Al-Fatihah', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Berikutnya', exact: true }).click();
  await expect(picker(page)).toHaveText(rukuk.variants[0].label);
  await expectContent(page, entries[1], entries[1].variants![0]);
  await page.getByRole('button', { name: 'Berikutnya', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Bacaan Bangkit dari Rukuk', exact: true }),
  ).toBeVisible();
  await expect(picker(page)).toHaveCount(0);
  await page.getByRole('button', { name: 'Sebelumnya', exact: true }).click();
  await expect(picker(page)).toHaveText(rukuk.variants[0].label);
  await page.reload();
  await expectContent(page, entries[1], entries[1].variants![0]);

  // Rukuk and sujud share a variant ID, but not a storage key.
  await page.goto(direct(entries[2]));
  await expect(picker(page)).toHaveText(sujud.defaultVersionLabel);
  await expectContent(page, entries[2]);
  await page.goto(direct(entries[1]));
  await expect(picker(page)).toHaveText(rukuk.variants[0].label);
  await select(page, rukuk.defaultVersionLabel);
  await page.goto(sequence);
  await expectContent(page, entries[1]);
  await page.getByRole('button', { name: 'Sebelumnya', exact: true }).click();
  await page.getByRole('button', { name: 'Sebelumnya', exact: true }).click();
  await expect(picker(page)).toHaveText(iftitah.variants[0].label);
  await expectContent(page, entries[0], entries[0].variants![0]);
  await expectStored(page, entries[0], iftitah.variants[0].id);
  await expectStored(page, entries[1], 'default');
});

for (const route of [sequence, direct(entries[1])]) {
  test(`invalid saved variant falls back and remains usable: ${route}`, async ({ page }) => {
    await page.addInitScript(
      (key) => localStorage.setItem(key, 'removed-variant'),
      storageKey(entries[1]),
    );
    await page.goto(route);
    // Opening the hydrated picker avoids asserting only the prerendered default.
    await picker(page).click();
    await expect(
      page.getByRole('option', { name: rukuk.defaultVersionLabel, exact: true }),
    ).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('Escape');
    await expectContent(page, entries[1]);
    await select(page, rukuk.variants[0].label);
    await expectContent(page, entries[1], entries[1].variants![0]);
    await expectStored(page, entries[1], rukuk.variants[0].id);
  });

  test(`denied storage does not prevent switching: ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.addInitScript(() => {
      for (const method of ['getItem', 'setItem']) {
        Object.defineProperty(Storage.prototype, method, {
          configurable: true,
          value() {
            throw new DOMException('Storage denied', 'SecurityError');
          },
        });
      }
    });
    await page.goto(route);
    await select(page, rukuk.variants[0].label);
    await expectContent(page, entries[1], entries[1].variants![0]);
    await select(page, rukuk.defaultVersionLabel);
    await expectContent(page, entries[1]);
    await page.reload();
    await select(page, rukuk.variants[0].label);
    await expectContent(page, entries[1], entries[1].variants![0]);
    expect(errors).toEqual([]);
  });
}

test('unvaried reading has no picker on its standalone route', async ({ page }) => {
  await page.goto(sequence);
  await page.getByRole('button', { name: 'Berikutnya', exact: true }).click();
  const slug = await page.locator('article').getAttribute('id');
  expect(slug).toBeTruthy();
  await page.goto(`/read/prayer/${slug}/`);
  await expect(
    page.getByRole('heading', { name: 'Bacaan Bangkit dari Rukuk', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Pengaturan bacaan' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(picker(page)).toHaveCount(0);
});

test('prerendered default content is readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    for (const entry of entries) {
      const response = await page.goto(`http://127.0.0.1:4173${direct(entry)}`);
      expect(response?.status()).toBe(200);
      await expectContent(page, entry);
      await expect(picker(page)).toHaveText(entry.defaultVersionLabel!);
    }
  } finally {
    await context.close();
  }
});
