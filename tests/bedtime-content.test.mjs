import { test } from 'node:test';
import assert from 'node:assert/strict';
import { records, categories, categoryReadings } from './helpers/content.mjs';
import { resolveReading } from '../src/lib/content/resolve-reading.mjs';

const category = categories.find((category) => category.id === 'bedtime');
const entries = categoryReadings('bedtime');
test('bedtime has nine shared readings with three separate surahs', () => {
  assert.equal(entries.length, 9);
  assert.deepEqual(
    entries.slice(1, 4).map((entry) => entry.slug),
    ['surah-al-ikhlas', 'surah-al-falaq', 'surah-an-nas'],
  );
  for (const item of category.items.slice(0, -1))
    assert(
      categories.some(
        (other) =>
          other.id !== 'bedtime' &&
          other.items.some((otherItem) => otherItem.entryId === item.entryId),
      ),
    );
  assert(!('itemOverrides' in category));
});
test('bedtime variants preserve text and isolate contextual counts and sources', () => {
  const snapshot = JSON.stringify(records);
  for (const item of category.items) {
    const record = records.find((entry) => entry.id === item.entryId);
    const entry = resolveReading(item, record);
    for (const key of ['arabic', 'transliteration', 'translation'])
      assert.equal(entry[key], record.text[key]);
    assert.match(entry.arabic, /[\u0600-\u06ff]/u);
    assert(!entry.arabic.includes('?'));
    assert.equal(entry.variants.length, 0);
  }
  assert.equal(JSON.stringify(records), snapshot);
  for (const entry of entries.slice(1, 4)) {
    assert.equal(entry.sources[0].url, 'https://sunnah.com/bukhari:5017');
    assert.match(entry.readingInstruction, /3x/);
    assert.deepEqual(entry.virtues, []);
  }
  const morning = categoryReadings('morning');
  assert.equal(morning[1].sources[0].url, 'https://sunnah.com/abudawud:5082');
  assert.deepEqual(
    entries.slice(4, 7).map((entry) => entry.repetitions),
    [33, 33, 34],
  );
  assert.equal(entries[6].title, 'Takbir Sebelum Tidur');
  assert.equal(categoryReadings('post-prayer')[5].repetitions, 33);
  assert.equal(entries[6].sources[0].url, 'https://sunnah.com/bukhari:5361');
});
test('night-awakening dhikr remains conditional without an invented repetition count', () => {
  const entry = entries.at(-1);
  assert.match(entry.readingInstruction, /saat terbangun di malam hari/);
  assert.equal(entry.repetitions, undefined);
  assert.equal(entry.sources[0].url, 'https://sunnah.com/bukhari:1154');
});
