import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dailyIndex, dailyKey } from '../src/lib/utils/daily.mjs';
import { validate, validateDirectory } from '../scripts/validate-content.mjs';
import { records, categories, reading } from './helpers/content.mjs';
import { createEntry, entryFilename } from '../scripts/create-entry.mjs';

test('daily selection uses the local date and changes at midnight', () => {
  assert.equal(dailyIndex(new Date(2026, 8, 6, 0, 1)), dailyIndex(new Date(2026, 8, 6, 23, 59)));
  assert.notEqual(dailyIndex(new Date(2026, 8, 6)), dailyIndex(new Date(2026, 8, 7)));
  assert.equal(dailyKey(new Date(2026, 0, 5)), '2026-01-05');
  assert.equal(dailyKey(new Date(2026, 11, 31)), '2026-12-31');
});
test('all entry files use the same strict schema and descriptive filename convention', () => {
  assert.doesNotThrow(validateDirectory);
  const keys = Object.keys(records[0]);
  const variantKeys = Object.keys(records[0].variants[0]);
  for (const entry of records) {
    assert.deepEqual(Object.keys(entry), keys);
    for (const variant of entry.variants) assert.deepEqual(Object.keys(variant), variantKeys);
  }
});

test('slugs have at most four words including their type prefix', () => {
  for (const entry of records) assert(entry.slug.split('-').length <= 4);
  for (const slug of ['dzikir-satu-dua-tiga-empat', 'tanpa-tipe', 'surah_al_ikhlas']) {
    assert.throws(() => validate([{ ...records[0], slug }], []), /Invalid or lengthy slug/);
  }
  const filename = entryFilename(
    { title: 'Doa Memohon Kesehatan dan Perlindungan Kepada Allah' },
    'morning',
  );
  assert(filename.slice(0, -5).split('_').length <= 4);
});

test('the importer emits the same schema with explicit empty metadata', () => {
  const imported = createEntry({
    id: 'fixture',
    slug: 'dzikir-fixture',
    type: 'dhikr',
    title: 'Dzikir Fixture',
    arabic: 'ذكر',
    transliteration: 'Fixture',
    translation: 'Fixture',
    sources: [{ id: 'fixture-source', type: 'book', label: 'Fixture' }],
    virtues: [],
  });
  assert.doesNotThrow(() => validate([imported], []));
  assert.equal(imported.variants[0].repetitions, null);
  assert.equal(imported.variants[0].text, null);
  assert.equal(imported.variants[0].sources[0].url, null);
  assert.equal(entryFilename(imported, 'morning'), 'dzikir_fixture_morning.json');
});
test('categories select only an entry and an existing variant', () => {
  for (const category of categories) {
    assert(!('itemIds' in category));
    assert(!('itemOverrides' in category));
    for (const item of category.items)
      assert.deepEqual(Object.keys(item), ['entryId', 'variantId']);
  }
  const category = structuredClone(categories[0]);
  category.items[0].entryId = 'missing';
  assert.throws(() => validate(records, [category]), /Missing reading/);
  category.items[0] = { ...categories[0].items[0], variantId: 'missing' };
  assert.throws(() => validate(records, [category]), /Missing variant/);
  category.items[0] = { ...categories[0].items[0], repetitions: 42 };
  assert.throws(() => validate(records, [category]), /category item fields/);
});
test('validator rejects malformed categories and legacy overrides', () => {
  for (const patch of [
    { items: [] },
    { readingMode: 'invalid' },
    { kind: 'invalid' },
    { itemOverrides: {} },
  ]) {
    assert.throws(() => validate(records, [{ ...categories[0], ...patch }]));
  }
});
test('Ayat Kursi retains its linked morning and evening virtue', () => {
  const entry = reading('ayat-kursi');
  assert.equal(entry.virtues.length, 1);
  assert.match(entry.virtues[0].text, /pagi.*petang/);
  assert.match(entry.virtues[0].text, /petang.*pagi/);
  const source = entry.sources.find((source) => source.id === entry.virtues[0].sourceIds[0]);
  assert.equal(source.url, 'https://sunnah.com/hisn:75');
  assert(entry.sources.some((source) => source.type === 'quran'));
});
test('both tauhid recitations retain the daily hundred-times virtue and source', () => {
  for (const slug of ['dzikir-tauhid-petang', 'dzikir-tauhid-pagi']) {
    const entry = reading(slug);
    assert.match(entry.virtues[0].text, /100 kali dalam sehari/);
    assert.match(entry.virtues[0].text, /hingga petang/);
    assert.match(entry.virtues[0].text, /kecuali orang/);
    const source = entry.sources.find((source) => source.id === entry.virtues[0].sourceIds[0]);
    assert.equal(source.url, 'https://www.hadits.id/hadits/bukhari/3293');
  }
});
