import { test } from 'node:test';
import assert from 'node:assert/strict';
import { categories, categoryReadings, reading } from './helpers/content.mjs';

test('four dua menus separate daily routines, worship, circumstances and travel', () => {
  assert.deepEqual(
    categories.filter((c) => c.kind === 'dua').map((c) => c.title),
    ["Do'a sehari-hari", "Do'a seputar ibadah", "Do'a di berbagai keadaan", "Do'a saat perjalanan"],
  );
  assert.equal(categoryReadings('daily-duas').length, 7);
  assert.deepEqual(
    categoryReadings('worship-duas').map((e) => e.slug),
    ['doa-masuk-masjid', 'doa-keluar-masjid', 'doa-setelah-adzan'],
  );
  assert.equal(categoryReadings('travel-duas').length, 9);
});

test('shared travel readings have independent instructions and no invented counts', () => {
  for (const [slug, variant] of [
    ['dzikir-takbir', 'ascent'],
    ['dzikir-tasbih', 'descent'],
    ['doa-perlindungan-makhluk', 'stopover'],
  ]) {
    const entry = reading(slug, variant);
    assert.equal(entry.repetitions, undefined);
    assert.equal(entry.arabic, reading(slug).arabic);
    assert.notEqual(entry.sources[0].url, reading(slug).sources[0].url);
  }
  assert.equal(reading('dzikir-takbir').repetitions, 33);
  assert.equal(reading('dzikir-takbir', 'bedtime').repetitions, 34);
  assert.equal(reading('doa-perlindungan-makhluk').repetitions, 3);
});
