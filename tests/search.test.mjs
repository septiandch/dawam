import { test } from 'node:test';
import assert from 'node:assert/strict';
import { categories, records } from './helpers/content.mjs';
import { createSearchIndex, searchReadings } from '../src/lib/content/search.mjs';

const index = createSearchIndex(categories, records);

test('global search covers every published category selection without duplicate results', () => {
  assert.equal(
    index.length,
    categories.reduce((count, category) => count + category.items.length, 0),
  );
  assert.equal(new Set(index.map((entry) => entry.id)).size, index.length);
  assert.deepEqual(searchReadings(index, '  '), []);
  assert.deepEqual(searchReadings(index, 'bacaan-yang-tidak-ada-xyz'), []);
});

test('global search prioritizes titles, supports multiple words, and ignores case', () => {
  const results = searchReadings(index, 'DOA SETELAH MAKAN');
  assert.equal(results[0].title, 'Doa Setelah Makan');
  assert.equal(results[0].href, '/read/daily-duas/doa-setelah-makan/');
  assert(
    searchReadings(index, 'memberiku makanan').some((entry) => entry.title === 'Doa Setelah Makan'),
  );
});

test('global search handles Arabic marks and Latin transliteration accents', () => {
  const titles = (query) => searchReadings(index, query).map((entry) => entry.id);
  assert.deepEqual(titles('بِسْمِ اللَّهِ'), titles('بسم الله'));
  assert(searchReadings(index, 'بسم الله').some((entry) => entry.title === 'Doa Sebelum Makan'));
  assert(
    searchReadings(index, 'subhanallah').some((entry) => entry.title === 'Tasbih Sebelum Tidur'),
  );
});

test('shared recitations open in their matching category and sequence position', () => {
  const results = searchReadings(index, 'takbir');
  const bedtime = results.find((entry) => entry.title === 'Takbir Sebelum Tidur');
  const postPrayer = results.find((entry) => entry.title === 'Takbir Setelah Shalat');
  assert.equal(bedtime.href, '/read/bedtime/?mode=sequence&start=dzikir-takbir');
  assert.equal(postPrayer.href, '/read/post-prayer/?mode=sequence&start=dzikir-takbir');
});
