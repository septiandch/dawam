import { test, expect, type Page } from '@playwright/test';

const collections = [
  { category: 'daily-duas', slug: 'doa-bangun-tidur', title: 'Doa Bangun Tidur' },
  { category: 'prayer', slug: 'shalat-tasbih-rukuk', title: 'Tasbih Rukuk' },
] as const;

const hintName = 'Petunjuk pilih bacaan';
const hintText = 'Ingin langsung ke bacaan tertentu? Tekan tombol daftar ini untuk memilih bacaan.';
const hintStorageKey = 'dawam-reading-list-hint-seen';

function listLink(page: Page) {
  return page.getByRole('banner').getByRole('link', { name: 'Pilih bacaan', exact: true });
}

async function expectReadingHeader(
  page: Page,
  category: string,
  mode: 'sequence' | 'single' | 'entry',
) {
  const header = page.getByRole('banner');
  const backToHome = mode === 'sequence' || (category === 'daily-duas' && mode === 'single');
  const backName = backToHome
    ? 'Kembali ke beranda'
    : mode === 'single'
      ? 'Kembali ke bacaan'
      : 'Kembali ke daftar bacaan';
  const back = header.getByRole('link', { name: backName, exact: true });
  await expect(back).toHaveAttribute(
    'href',
    backToHome ? '/' : `/read/${category}/${mode === 'entry' ? '?mode=single' : ''}`,
  );
  await expect(listLink(page)).toHaveAttribute('href', `/read/${category}/?mode=single`);
  await expect(listLink(page).locator('svg')).toBeVisible();
  if (mode === 'single') {
    await expect(listLink(page)).toHaveAttribute('aria-current', 'page');
  } else {
    await expect(listLink(page)).not.toHaveAttribute('aria-current', 'page');
  }
  // The list action is the next header link after Back, with no intervening navigation action.
  const links = header.getByRole('link');
  await expect(links.nth(0)).toHaveAccessibleName(backName);
  await expect(links.nth(1)).toHaveAccessibleName('Pilih bacaan');
  await expect(page.getByRole('navigation', { name: 'Mode membaca' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Baca berurutan', exact: true })).toHaveCount(0);
}

async function expectSingleReading(page: Page, title: string) {
  await expect(page.locator('article')).toHaveCount(1);
  await expect(
    page.locator('article').getByRole('heading', { name: title, exact: true }),
  ).toBeVisible();
  await expect(page.locator('article p[lang="ar"]')).toBeVisible();
  await expect(page.locator('article p[lang="ar"]')).toHaveAttribute('dir', 'rtl');
  await expect(page.getByRole('button', { name: 'Berikutnya', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Sebelumnya', exact: true })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Kembali ke daftar bacaan' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Pilih bacaan lain', exact: true })).toBeVisible();
}

async function expectSequenceReading(page: Page, title: string, position: string) {
  await expect(page.getByRole('status')).toHaveText(position);
  await expect(page.locator('article')).toHaveCount(1);
  await expect(
    page.locator('article').getByRole('heading', { name: title, exact: true }),
  ).toBeVisible();
  await expect(page.locator('article p[lang="ar"]')).toBeVisible();
  await expect(page.locator('article p[lang="ar"]')).toHaveAttribute('dir', 'rtl');
  await expect(page.getByRole('button', { name: 'Sebelumnya', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Berikutnya', exact: true })).toBeVisible();
}

async function expectNoOverflow(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

async function expectDailyDuasCatalog(page: Page) {
  await expectReadingHeader(page, 'daily-duas', 'single');
  await expect(page.getByRole('searchbox', { name: 'Cari bacaan' })).toBeVisible();
  await expect(page.getByRole('main').getByRole('listitem')).toHaveCount(5);
  for (const link of await page.getByRole('main').getByRole('listitem').getByRole('link').all()) {
    await expect(link).toHaveAttribute('href', /^\/read\/daily-duas\/[^/?]+\/$/);
  }
  await expect(page.getByRole('link', { name: 'Doa Bangun Tidur', exact: true })).toHaveAttribute(
    'href',
    '/read/daily-duas/doa-bangun-tidur/',
  );
  await expect(page.locator('article')).toHaveCount(0);
  await expect(page.getByRole('status')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Berikutnya', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Sebelumnya', exact: true })).toHaveCount(0);
}

for (const { category, slug, title } of collections) {
  const single = category === 'daily-duas';
  const readingHref = single
    ? `/read/${category}/${slug}/`
    : `/read/${category}/?mode=sequence&start=${slug}`;
  test(`${category} opens a searchable catalog and selects its configured reading mode`, async ({
    page,
  }) => {
    await page.goto(`/read/${category}/`);
    if (single) {
      await expectDailyDuasCatalog(page);
    } else {
      await expect(page.getByRole('status')).toHaveText('Pembuka');
      await expectReadingHeader(page, category, 'sequence');
    }
    await listLink(page).click();
    await expect(page).toHaveURL(`/read/${category}/?mode=single`);
    await expectReadingHeader(page, category, 'single');
    const search = page.getByRole('searchbox', { name: 'Cari bacaan' });
    const item = page.getByRole('link', { name: title, exact: true });
    await expect(search).toBeVisible();
    await expect(page.getByRole('link', { name: 'Pilih bacaan', exact: true })).toHaveAttribute(
      'aria-current',
      'page',
    );

    await expect(item).toHaveAttribute('href', readingHref);
    await search.fill('zzzz-no-matching-reading-zzzz');

    await expect(
      page.getByText('Tidak ada bacaan yang cocok. Coba kata kunci lain.', { exact: true }),
    ).toBeVisible();
    await expect(page.getByRole('main').getByRole('listitem')).toHaveCount(0);
    await search.fill(title);
    await expect(page.getByRole('main').getByRole('listitem')).toHaveCount(1);
    await item.click();
    await expect(page).toHaveURL(readingHref);
    if (single) {
      await expectSingleReading(page, title);
      await expectReadingHeader(page, category, 'entry');
    } else {
      await expectSequenceReading(page, title, '4 dari 13');
      await expectReadingHeader(page, category, 'sequence');
    }
    await listLink(page).click();
    await expect(page).toHaveURL(`/read/${category}/?mode=single`);
    await expect(search).toHaveValue('');
    await expect(item).toBeVisible();
  });

  test(`${category} single reading supports direct navigation, reload, and choosing another reading`, async ({
    page,
  }) => {
    await page.goto(`/read/${category}/${slug}/`);
    await expectSingleReading(page, title);
    await page.reload();
    await expectSingleReading(page, title);
    await expectReadingHeader(page, category, 'entry');
    await listLink(page).click();
    await expect(page).toHaveURL(`/read/${category}/?mode=single`);
    await expect(page.getByRole('searchbox', { name: 'Cari bacaan' })).toBeVisible();
    await expect(page.getByRole('link', { name: title, exact: true })).toBeVisible();
  });
}

for (const category of ['morning', 'evening', 'prayer']) {
  test(`${category} can explicitly use sequence mode`, async ({ page }) => {
    await page.goto(`/read/${category}/?mode=sequence`);
    await expect(page.getByRole('status')).toHaveText('Pembuka');
    await expect(page.locator('article')).toHaveCount(0);
    await expect(page.getByRole('searchbox', { name: 'Cari bacaan' })).toHaveCount(0);
    await page.getByRole('button', { name: 'Berikutnya', exact: true }).click();
    await expect(page.getByRole('status')).toHaveText(/^1 dari \d+$/);
    await expect(page.locator('article')).toHaveCount(1);
    await page.getByRole('button', { name: 'Sebelumnya', exact: true }).click();
    await expect(page.getByRole('status')).toHaveText('Pembuka');
  });
}

for (const category of ['morning', 'evening', 'prayer']) {
  test(`${category} defaults to sequence mode`, async ({ page }) => {
    await page.goto(`/read/${category}/`);
    await expect(page.getByRole('status')).toHaveText('Pembuka');
    await expectReadingHeader(page, category, 'sequence');
    await expect(page.getByRole('searchbox', { name: 'Cari bacaan' })).toHaveCount(0);
    await expect(page.locator('article')).toHaveCount(0);
    await page.getByRole('button', { name: 'Berikutnya', exact: true }).click();
    await expect(page.locator('article')).toHaveCount(1);
  });
}

for (const query of [
  '',
  '?mode=single',
  '?mode=sequence',
  '?start=doa-bangun-tidur',
  '?mode=single&start=doa-bangun-tidur',
  '?mode=sequence&start=doa-bangun-tidur',
]) {
  test(`daily-duas always opens the catalog: ${query || 'default'}`, async ({ page }) => {
    await page.goto(`/read/daily-duas/${query}`);
    await expectDailyDuasCatalog(page);
    await page.reload();
    await expectDailyDuasCatalog(page);
    await page
      .getByRole('banner')
      .getByRole('link', { name: 'Kembali ke beranda', exact: true })
      .click();
    await expect(page).toHaveURL('/');
  });
}

test.describe('daily-duas prerendered catalog without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  for (const query of ['', '?mode=single', '?mode=sequence&start=doa-bangun-tidur']) {
    test(`ignores sequence and start without hydration: ${query || 'default'}`, async ({
      page,
    }) => {
      const response = await page.goto(`/read/daily-duas/${query}`);
      expect(response?.status()).toBe(200);
      await expectDailyDuasCatalog(page);
      await listLink(page).click();
      await expect(page).toHaveURL('/read/daily-duas/?mode=single');
      await expectDailyDuasCatalog(page);
      await page.getByRole('link', { name: 'Doa Bangun Tidur', exact: true }).click();
      await expect(page).toHaveURL('/read/daily-duas/doa-bangun-tidur/');
      await expectSingleReading(page, 'Doa Bangun Tidur');
      await expectReadingHeader(page, 'daily-duas', 'entry');
    });
  }
});

test('filtered prayer selection preserves collection order and reloads the selected start', async ({
  page,
}) => {
  await page.goto('/read/prayer/?mode=single');
  await page.getByRole('searchbox', { name: 'Cari bacaan' }).fill('Tasbih Rukuk');
  await expect(page.getByRole('main').getByRole('listitem')).toHaveCount(1);
  await page.getByRole('link', { name: 'Tasbih Rukuk', exact: true }).click();
  await expect(page).toHaveURL('/read/prayer/?mode=sequence&start=shalat-tasbih-rukuk');
  await expectSequenceReading(page, 'Tasbih Rukuk', '4 dari 13');
  await page.getByRole('button', { name: 'Sebelumnya', exact: true }).click();
  await expectSequenceReading(page, 'Surah Al-Fatihah', '3 dari 13');
  await page.getByRole('button', { name: 'Berikutnya', exact: true }).click();
  await expectSequenceReading(page, 'Tasbih Rukuk', '4 dari 13');
  await page.getByRole('button', { name: 'Berikutnya', exact: true }).click();
  await expectSequenceReading(page, 'Bacaan Bangkit dari Rukuk', '5 dari 13');
  await page.reload();
  await expectSequenceReading(page, 'Tasbih Rukuk', '4 dari 13');
});

test('selecting the last prayer reading leads to the closing card', async ({ page }) => {
  await page.goto('/read/prayer/?mode=single');
  const lastItem = page.getByRole('main').getByRole('listitem').last().getByRole('link');
  const title = await lastItem.innerText();
  await expect(lastItem).toHaveAttribute('href', /\/read\/prayer\/\?mode=sequence&start=.+/);
  await lastItem.click();
  await expectSequenceReading(page, title.trim(), '13 dari 13');
  await page.getByRole('button', { name: 'Berikutnya', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Penutup');
  await expect(page.locator('article')).toHaveCount(0);
});

for (const start of ['not-a-reading', 'doa-bangun-tidur']) {
  test(`invalid prayer start falls back to the introduction: ${start}`, async ({ page }) => {
    await page.goto(`/read/prayer/?mode=sequence&start=${start}`);
    await expect(page.getByRole('status')).toHaveText('Pembuka');
    await expect(page.locator('article')).toHaveCount(0);
    await page.getByRole('button', { name: 'Berikutnya', exact: true }).click();
    await expectSequenceReading(page, 'Takbiratul Ihram', '1 dari 13');
  });
}

test('morning switches between catalog and sequence modes', async ({ page }) => {
  await page.goto('/read/morning/');
  await listLink(page).click();
  await expect(page).toHaveURL('/read/morning/?mode=single');
  await expect(page.getByRole('searchbox', { name: 'Cari bacaan' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Ayat Kursi', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Berikutnya', exact: true })).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('searchbox', { name: 'Cari bacaan' })).toBeVisible();
  await expectReadingHeader(page, 'morning', 'single');
  await page
    .getByRole('banner')
    .getByRole('link', { name: 'Kembali ke bacaan', exact: true })
    .click();
  await expect(page).toHaveURL('/read/morning/');
  await expect(page.getByRole('status')).toHaveText('Pembuka');
  await expect(page.locator('article')).toHaveCount(0);
  await page.getByRole('button', { name: 'Berikutnya', exact: true }).click();
  await expect(page.locator('article')).toContainText('Ayat Kursi');
  await page.reload();
  await expect(page.getByRole('status')).toHaveText('Pembuka');
});

test('prayer catalog, single reading, and sequence do not overflow at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/read/prayer/');
  const hint = page.getByRole('banner').getByRole('note', { name: hintName });
  await expect(hint).toBeVisible();
  await expect(hint).toContainText(hintText);
  await expectNoOverflow(page);
  const bounds = await hint.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320);
  await listLink(page).click();
  await expect(hint).toHaveCount(0);
  await expect(page.getByRole('searchbox', { name: 'Cari bacaan' })).toBeVisible();
  await expectNoOverflow(page);
  await page.getByRole('link', { name: 'Tasbih Rukuk', exact: true }).click();
  await expect(page).toHaveURL('/read/prayer/?mode=sequence&start=shalat-tasbih-rukuk');
  await expectSequenceReading(page, 'Tasbih Rukuk', '4 dari 13');
  await expectNoOverflow(page);
  await page.goto('/read/prayer/shalat-tasbih-rukuk/');
  await expectSingleReading(page, 'Tasbih Rukuk');
  await expectNoOverflow(page);
  await page.getByRole('link', { name: 'Kembali ke daftar bacaan' }).click();
  await page
    .getByRole('banner')
    .getByRole('link', { name: 'Kembali ke bacaan', exact: true })
    .click();
  await expect(page.getByRole('status')).toHaveText('Pembuka');
  await expectNoOverflow(page);
  await page.getByRole('button', { name: 'Berikutnya', exact: true }).click();
  await expect(page.locator('article')).toHaveCount(1);
  await expectNoOverflow(page);
});

test('reading-list hint is marked seen on first view and stays dismissed across reloads and categories', async ({
  page,
}) => {
  await page.goto('/read/morning/');
  const hint = page.getByRole('banner').getByRole('note', { name: hintName });
  await expect(hint).toBeVisible();
  await expect(hint).toContainText(hintText);
  await expect
    .poll(() => page.evaluate((key) => localStorage.getItem(key), hintStorageKey))
    .toBe('true');
  await hint.getByRole('button', { name: 'Mengerti', exact: true }).click();
  await expect(hint).toHaveCount(0);
  await page.reload();
  await expectReadingHeader(page, 'morning', 'sequence');
  await expect(hint).toHaveCount(0);
  await page.getByRole('banner').getByRole('link', { name: 'Kembali ke beranda' }).click();
  await page.goto('/read/prayer/');
  await expectReadingHeader(page, 'prayer', 'sequence');
  await expect(hint).toHaveCount(0);
});

// Each test receives a fresh browser context, so this exercises the first-view Escape path.
test('Escape dismisses a fresh reading-list hint without requiring acknowledgement', async ({
  page,
}) => {
  await page.goto('/read/evening/');
  const hint = page.getByRole('note', { name: hintName });
  await expect(hint).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(hint).toHaveCount(0);
  await page.reload();
  await expectReadingHeader(page, 'evening', 'sequence');
  await expect(hint).toHaveCount(0);
});

test('opening the reading list dismisses the hint and does not repeat it', async ({ page }) => {
  await page.goto('/read/daily-duas/');
  const hint = page.getByRole('note', { name: hintName });
  await expect(hint).toBeVisible();
  await listLink(page).click();
  await expect(page).toHaveURL('/read/daily-duas/?mode=single');
  await expectDailyDuasCatalog(page);
  await expect(hint).toHaveCount(0);
  await page
    .getByRole('banner')
    .getByRole('link', { name: 'Kembali ke beranda', exact: true })
    .click();
  await expect(page).toHaveURL('/');
  await page.goto('/read/daily-duas/');
  await expectDailyDuasCatalog(page);
  await expect(hint).toHaveCount(0);
});

test('reload without acknowledgement does not repeat a hint already shown', async ({ page }) => {
  await page.goto('/read/morning/');
  await expect(page.getByRole('note', { name: hintName })).toBeVisible();
  await expect
    .poll(() => page.evaluate((key) => localStorage.getItem(key), hintStorageKey))
    .toBe('true');
  await page.reload();
  await expectReadingHeader(page, 'morning', 'sequence');
  await expect(page.getByRole('note', { name: hintName })).toHaveCount(0);
});

test('reading-list hint and navigation remain usable when storage throws', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    for (const method of ['getItem', 'setItem']) {
      Object.defineProperty(Storage.prototype, method, {
        configurable: true,
        value() {
          throw new DOMException('Storage blocked', 'SecurityError');
        },
      });
    }
  });
  await page.goto('/read/daily-duas/');
  const hint = page.getByRole('note', { name: hintName });
  await expect(hint).toBeVisible();
  await hint.getByRole('button', { name: 'Mengerti', exact: true }).click();
  await expect(hint).toHaveCount(0);
  await listLink(page).click();
  await expectReadingHeader(page, 'daily-duas', 'single');
  await page.getByRole('searchbox', { name: 'Cari bacaan' }).fill('Doa Bangun Tidur');
  await page.getByRole('link', { name: 'Doa Bangun Tidur', exact: true }).click();
  await expect(page).toHaveURL('/read/daily-duas/doa-bangun-tidur/');
  await expectSingleReading(page, 'Doa Bangun Tidur');
  await expectReadingHeader(page, 'daily-duas', 'entry');
  await listLink(page).click();
  await expectDailyDuasCatalog(page);
  await page
    .getByRole('banner')
    .getByRole('link', { name: 'Kembali ke beranda', exact: true })
    .click();
  await expect(page).toHaveURL('/');
  await page.goto('/read/daily-duas/?mode=sequence&start=doa-bangun-tidur');
  await expectDailyDuasCatalog(page);
  await page.goto('/read/prayer/?mode=single');
  await expectReadingHeader(page, 'prayer', 'single');
  await page
    .getByRole('banner')
    .getByRole('link', { name: 'Kembali ke bacaan', exact: true })
    .click();
  await expect(page.getByRole('status')).toHaveText('Pembuka');
  await page.getByRole('button', { name: 'Berikutnya', exact: true }).click();
  await expect(page.locator('article')).toHaveCount(1);
  expect(errors).toEqual([]);
});

for (const path of [
  '/read/daily-duas/shalat-tasbih-rukuk/',
  '/read/prayer/doa-bangun-tidur/',
  '/read/morning/doa-bangun-tidur/',
]) {
  test(`rejects a reading outside its category: ${path}`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: 'Bacaan tidak ditemukan' })).toBeVisible();
    await expect(page.locator('article')).toHaveCount(0);
  });
}

test('new catalogs and single readings are available offline after service worker readiness', async ({
  page,
  context,
}) => {
  await page.goto('/');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) {
      await new Promise<void>((resolve) => {
        navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), {
          once: true,
        });
      });
    }
  });

  // Do not warm these routes online: they must be available from the precache.
  await context.setOffline(true);
  try {
    for (const { category, slug, title } of collections) {
      const single = category === 'daily-duas';
      const readingHref = single
        ? `/read/${category}/${slug}/`
        : `/read/${category}/?mode=sequence&start=${slug}`;
      await page.goto(`/read/${category}/`);
      if (single) {
        await expectDailyDuasCatalog(page);
      } else {
        await expect(page.getByRole('status')).toHaveText('Pembuka');
      }
      await listLink(page).click();
      await expect(page.getByRole('searchbox', { name: 'Cari bacaan' })).toBeVisible();
      const item = page.getByRole('link', { name: title, exact: true });
      await expect(item).toHaveAttribute('href', readingHref);
      await item.click();
      await expect(page).toHaveURL(readingHref);
      if (single) {
        await expectSingleReading(page, title);
        await page.reload();
        await expectSingleReading(page, title);
      } else {
        await expectSequenceReading(page, title, '4 dari 13');
        await page.reload();
        await expectSequenceReading(page, title, '4 dari 13');
      }
      await page.goto(`/read/${category}/${slug}/`);
      await expectSingleReading(page, title);
      await page.reload();
      await expectSingleReading(page, title);
      await page.getByRole('link', { name: 'Kembali ke daftar bacaan' }).click();
      await expect(page.getByRole('searchbox', { name: 'Cari bacaan' })).toBeVisible();
      await expectReadingHeader(page, category, 'single');
      if (single) {
        await expectDailyDuasCatalog(page);
        await page
          .getByRole('banner')
          .getByRole('link', { name: 'Kembali ke beranda', exact: true })
          .click();
        await expect(page).toHaveURL('/');
        await page.goto('/read/daily-duas/?mode=sequence&start=doa-bangun-tidur');
        await expectDailyDuasCatalog(page);
        await page.reload();
        await expectDailyDuasCatalog(page);
        continue;
      }
      await page
        .getByRole('banner')
        .getByRole('link', { name: 'Kembali ke bacaan', exact: true })
        .click();
      await expect(page.getByRole('status')).toHaveText('Pembuka');
      await page.getByRole('button', { name: 'Berikutnya', exact: true }).click();
      await expect(page.locator('article')).toHaveCount(1);
    }
  } finally {
    await context.setOffline(false);
  }
});
