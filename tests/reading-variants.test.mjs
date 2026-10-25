import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate } from '../scripts/validate-content.mjs';
import { record, reading } from './helpers/content.mjs';
import { resolveReading } from '../src/lib/content/resolve-reading.mjs';

const source = record('shalat-tasbih-rukuk');
const check = (entry) => validate([entry], []);
const mutate = (change) => {
  const entry = structuredClone(source);
  change(entry.variants[1], entry);
  return entry;
};
test('prayer alternatives resolve independently with all wording, counts, notes, and sources', () => {
  for (const slug of ['shalat-doa-iftitah', 'shalat-tasbih-rukuk', 'shalat-tasbih-sujud']) {
    const entry = record(slug);
    assert.doesNotThrow(() => check(entry));
    const base = reading(slug);
    assert(base.variants.length > 0);
    for (const variant of base.variants) {
      assert.notEqual(variant.arabic, base.arabic);
      assert.notEqual(variant.transliteration, base.transliteration);
      assert.notEqual(variant.translation, base.translation);
      assert.notEqual(variant.notes, base.notes);
      assert(variant.sources.length > 0);
    }
  }
  assert.equal(reading('shalat-tasbih-rukuk').repetitions, 3);
  assert(
    reading('shalat-tasbih-rukuk').variants.every((variant) => variant.repetitions === undefined),
  );
});
for (const key of [
  'id',
  'label',
  'title',
  'text',
  'repetitions',
  'readingInstruction',
  'notes',
  'sources',
  'virtues',
  'alternativeIds',
]) {
  test('validator rejects missing variant field ' + key, () =>
    assert.throws(() => check(mutate((variant) => delete variant[key]))),
  );
}
for (const repetitions of [0, -1, 1.5, '3']) {
  test('validator rejects invalid repetitions ' + repetitions, () =>
    assert.throws(() =>
      check(
        mutate((variant) => {
          variant.repetitions = repetitions;
        }),
      ),
    ),
  );
}
test('null explicitly represents no prescribed count and shared text', () => {
  assert.doesNotThrow(() =>
    check(
      mutate((variant) => {
        variant.text = null;
        variant.repetitions = null;
      }),
    ),
  );
});
test('variant sources cannot be omitted or inherited', () => {
  assert.throws(() =>
    check(
      mutate((variant) => {
        variant.sources = [];
      }),
    ),
  );
  for (const ref of ['missing-source', source.variants[0].sources[0].id])
    assert.throws(() =>
      check(
        mutate((variant) => {
          variant.virtues = [{ text: 'Fixture', sourceIds: [ref] }];
        }),
      ),
    );
  assert.doesNotThrow(() =>
    check(
      mutate((variant) => {
        variant.virtues = [{ text: 'Fixture', sourceIds: [variant.sources[0].id] }];
      }),
    ),
  );
});
test('validator rejects duplicate variants, missing defaults, and unknown alternatives', () => {
  assert.throws(() =>
    check(mutate((variant, entry) => entry.variants.push(structuredClone(variant)))),
  );
  assert.throws(() =>
    check(
      mutate((variant, entry) => {
        entry.defaultVariantId = 'missing';
      }),
    ),
  );
  assert.throws(() =>
    check(
      mutate((variant) => {
        variant.alternativeIds = ['missing'];
      }),
    ),
  );
  assert.throws(() => resolveReading({ entryId: source.id, variantId: 'missing' }, source));
});
test('context variants never leak into the wording picker', () => {
  const entry = record('dzikir-takbir');
  const bedtime = resolveReading({ entryId: entry.id, variantId: 'bedtime' }, entry);
  const postPrayer = resolveReading({ entryId: entry.id, variantId: 'default' }, entry);
  assert.equal(bedtime.repetitions, 34);
  assert.equal(postPrayer.repetitions, 33);
  assert.deepEqual(bedtime.variants, []);
  assert.deepEqual(postPrayer.variants, []);
});
