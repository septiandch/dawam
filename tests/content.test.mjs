import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { dailyIndex, dailyKey } from '../src/lib/utils/daily.mjs';
import { validate } from '../scripts/validate-content.mjs';

test('daily selection uses local calendar date, stable all day, rotates at midnight', () => {
  const morning = new Date(2026, 8, 6, 0, 1);
  const evening = new Date(2026, 8, 6, 23, 59);
  assert.equal(dailyIndex(morning), dailyIndex(evening));
  assert.notEqual(dailyIndex(evening), dailyIndex(new Date(2026, 8, 7, 0, 0)));
});

test('dailyKey is a local YYYY-MM-DD key, stable all day and rotating at midnight', () => {
  assert.equal(dailyKey(new Date(2026, 0, 5)), '2026-01-05');
  assert.equal(dailyKey(new Date(2026, 11, 31, 23, 59)), '2026-12-31');
  assert.equal(dailyKey(new Date(2026, 8, 6, 0, 1)), dailyKey(new Date(2026, 8, 6, 23, 59)));
  assert.notEqual(dailyKey(new Date(2026, 8, 6)), dailyKey(new Date(2026, 8, 7)));
});

test('validator rejects dangling collection references', () => {
  assert.throws(() => validate([], [{ slug: 'morning', itemIds: ['missing'] }]), /Missing reading/);
});

test('Ayat Kursi has a linked morning/evening virtue backed by a hadith source', () => {
  const entry = JSON.parse(
    readFileSync(
      new URL('../src/lib/content/entries/ayat-al-kursi-fd44.json', import.meta.url),
      'utf8',
    ),
  );
  assert.equal(entry.virtues.length, 1);
  const virtue = entry.virtues[0];
  assert.match(virtue.text, /pagi.*petang/);
  assert.match(virtue.text, /petang.*pagi/);
  assert.equal(virtue.sourceIds.length, 1);
  const source = entry.sources.find((source) => source.id === virtue.sourceIds[0]);
  assert.equal(source?.type, 'hadith');
  assert.equal(source.url, 'https://sunnah.com/hisn:75');
  assert(entry.sources.some((source) => source.type === 'quran'));
});

test('validator checks reading modes and category membership types', () => {
  const entry = JSON.parse(
    readFileSync(
      new URL('../src/lib/content/entries/doa-bangun-tidur.json', import.meta.url),
      'utf8',
    ),
  );
  const category = { slug: 'daily-duas', kind: 'dua', readingMode: 'single', itemIds: [entry.id] };
  assert.doesNotThrow(() => validate([entry], [category]));
  assert.throws(
    () => validate([entry], [{ ...category, readingMode: 'invalid' }]),
    /Invalid reading mode/,
  );
  assert.throws(
    () => validate([entry], [{ ...category, kind: 'dhikr' }]),
    /Category type mismatch/,
  );
});

test('both Dzikir Tauhid entries link the hundred-times daily virtue to Bukhari 3293', () => {
  for (const slug of ['dzikir-tauhid-b150', 'dzikir-tauhid-d18c']) {
    const entry = JSON.parse(
      readFileSync(new URL(`../src/lib/content/entries/${slug}.json`, import.meta.url), 'utf8'),
    );
    assert.equal(entry.virtues.length, 1);
    const virtue = entry.virtues[0];
    assert.match(virtue.text, /100 kali dalam sehari/);
    assert.match(virtue.text, /hingga petang/);
    assert.match(virtue.text, /kecuali orang yang beramal lebih banyak/);
    assert.equal(virtue.sourceIds.length, 1);
    const source = entry.sources.find((source) => source.id === virtue.sourceIds[0]);
    assert.equal(source?.type, 'hadith');
    assert.equal(source.url, 'https://www.hadits.id/hadits/bukhari/3293');
  }
});

test('validator rejects empty categories', () => {
  assert.throws(() => validate([], [{ slug: 'empty', itemIds: [] }]));
});

test('category display metadata is provided by the catalog', () => {
  const categories = JSON.parse(
    readFileSync(new URL('../src/lib/content/categories.json', import.meta.url), 'utf8'),
  );
  for (const category of categories) {
    assert(category.shortDescription.trim());
    assert(['sun', 'sunset', 'prayer-hands', 'book-open'].includes(category.icon));
  }
});

test('reading instructions are explicit and validated independently of notes', () => {
  const entry = JSON.parse(
    readFileSync(
      new URL('../src/lib/content/entries/shalat-istighfar-setelah-shalat.json', import.meta.url),
      'utf8',
    ),
  );
  assert(entry.readingInstruction.trim());
  assert.equal(entry.notes, undefined);
  for (const readingInstruction of [42, '', '   ', null]) {
    assert.throws(
      () => validate([{ ...entry, readingInstruction }], []),
      /Invalid reading instruction/,
    );
  }
});
