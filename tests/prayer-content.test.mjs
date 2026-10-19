import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const category = read('../src/lib/content/categories.json').find(
  (entry) => entry.slug === 'prayer',
);
const slugs = [
  'takbiratul-ihram',
  'doa-iftitah',
  'al-fatihah',
  'tasbih-rukuk',
  'bangkit-dari-rukuk',
  'pujian-iktidal',
  'tasbih-sujud',
  'doa-antara-dua-sujud',
  'tasyahud',
  'shalawat',
  'doa-sebelum-salam',
  'doa-memohon-pertolongan-ibadah',
  'salam',
];
const postPrayerSlugs = [
  'istighfar-setelah-shalat',
  'allahumma-antas-salam',
  'tauhid-setelah-shalat',
  'tasbih-setelah-shalat',
  'tahmid-setelah-shalat',
  'takbir-setelah-shalat',
  'tahlil-penutup-setelah-shalat',
];

test('prayer catalog includes sourced recitations from opening takbir to salam in order', () => {
  assert.deepEqual(
    category.itemIds,
    slugs.map((slug) => `prayer-${slug}`),
  );
  for (const slug of slugs) {
    const entry = read(`../src/lib/content/entries/shalat-${slug}.json`);
    assert.equal(entry.type, 'prayer_recitation');
    assert.equal(entry.id, `prayer-${slug}`);
    assert(entry.sources.some((source) => source.url?.startsWith('https://')));
  }
});

test('Al-Fatihah contains all seven numbered verses and keeps Quran provenance', () => {
  const entry = read('../src/lib/content/entries/shalat-al-fatihah.json');
  assert.deepEqual(entry.arabic.match(/\([1-7]\)/g), [
    '(1)',
    '(2)',
    '(3)',
    '(4)',
    '(5)',
    '(6)',
    '(7)',
  ]);
  assert(entry.sources.some((source) => source.type === 'quran'));
});

test('iftitah preserves four independent formulas and tashahhud offers an Ibn Abbas alternative', () => {
  const iftitah = read('../src/lib/content/entries/shalat-doa-iftitah.json');
  assert.deepEqual(
    iftitah.variants.map((version) => version.id),
    ['subhanaka-allahumma', 'wajjahtu-wajhiya', 'allahu-akbar-kabira'],
  );
  const tasyahud = read('../src/lib/content/entries/shalat-tasyahud.json');
  assert(tasyahud.variants.some((version) => version.id === 'ibn-abbas'));
});

test('post-prayer dhikr has a separate collection with sourced repetition counts', () => {
  const postPrayer = read('../src/lib/content/categories.json').find(
    (entry) => entry.slug === 'post-prayer',
  );
  assert.deepEqual(
    postPrayer.itemIds,
    postPrayerSlugs.map((slug) => `prayer-${slug}`),
  );
  assert.equal(postPrayer.kind, 'prayer_recitation');
  assert.equal(postPrayer.readingMode, 'sequence');
  assert(postPrayer.itemIds.every((id) => !category.itemIds.includes(id)));
  const afterSalam = postPrayerSlugs;
  const entries = afterSalam.map((slug) => read(`../src/lib/content/entries/shalat-${slug}.json`));
  for (const entry of entries) {
    assert.match(entry.arabic, /[\u0600-\u06ff]/u);
    assert(!entry.arabic.includes('?'));
    assert(!entry.transliteration.includes('?'));
  }
  assert.deepEqual(
    entries.map((entry) => entry.repetitions),
    [3, 1, 1, 33, 33, 33, 1],
  );
  assert.deepEqual(
    entries.map((entry) => entry.sources[0].url),
    ['591', '591', '593a', '597a', '597a', '597a', '597a'].map(
      (ref) => `https://sunnah.com/muslim:${ref}`,
    ),
  );
  assert.equal(
    entries.slice(3).reduce((sum, entry) => sum + entry.repetitions, 0),
    100,
  );
});
