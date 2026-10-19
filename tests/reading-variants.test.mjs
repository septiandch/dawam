import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import { validate } from '../scripts/validate-content.mjs';

const entries = ['shalat-doa-iftitah', 'shalat-tasbih-rukuk', 'shalat-tasbih-sujud'].map((slug) =>
  JSON.parse(
    readFileSync(new URL(`../src/lib/content/entries/${slug}.json`, import.meta.url), 'utf8'),
  ),
);

function check(entry) {
  validate(
    [entry],
    [{ slug: 'prayer', kind: 'prayer_recitation', readingMode: 'sequence', itemIds: [entry.id] }],
  );
}

function mutated(change) {
  const entry = structuredClone(entries[1]);
  change(entry.variants[0], entry);
  return entry;
}

test('actual iftitah, rukuk, and sujud variants validate as independent content', () => {
  for (const entry of entries) {
    assert.doesNotThrow(() => check(entry));
    assert.equal(typeof entry.defaultVersionLabel, 'string');
    assert(entry.defaultVersionLabel.trim());
    assert(entry.variants.length > 0);
    for (const variant of entry.variants) {
      for (const field of ['id', 'label', 'arabic', 'transliteration', 'translation']) {
        assert.equal(typeof variant[field], 'string');
        assert(variant[field].trim());
      }
      assert.notEqual(variant.arabic, entry.arabic);
      assert.notEqual(variant.transliteration, entry.transliteration);
      assert.notEqual(variant.translation, entry.translation);
      assert.notEqual(variant.notes, entry.notes);
      assert(variant.sources.length > 0);
      assert(Array.isArray(variant.virtues));
      assert(
        variant.sources.every((source) => !entry.sources.some((base) => base.id === source.id)),
      );
    }
  }
  for (const entry of entries.slice(1)) {
    assert.equal(entry.repetitions, 3);
    assert(entry.variants.every((variant) => variant.repetitions === undefined));
  }
});

test('variants and defaultVersionLabel remain optional', () => {
  const entry = structuredClone(entries[0]);
  delete entry.defaultVersionLabel;
  assert.doesNotThrow(() => check(entry));
  entry.variants = [];
  assert.doesNotThrow(() => check(entry));
  delete entry.variants;
  assert.doesNotThrow(() => check(entry));
});

test('variant notes and repetitions are optional, and positive integer counts are valid', () => {
  const entry = mutated((variant) => {
    delete variant.notes;
    delete variant.repetitions;
  });
  assert.doesNotThrow(() => check(entry));
  entry.variants[0].repetitions = 1;
  assert.doesNotThrow(() => check(entry));
});

for (const field of ['id', 'label', 'arabic', 'transliteration', 'translation']) {
  for (const value of [undefined, '', '   ', 42]) {
    test(`validator rejects variant ${field} set to ${JSON.stringify(value)}`, () => {
      const entry = mutated((variant) => {
        if (value === undefined) delete variant[field];
        else variant[field] = value;
      });
      assert.throws(() => check(entry));
    });
  }
}

for (const field of ['sources', 'virtues']) {
  test(`validator rejects missing variant ${field} rather than inheriting the base`, () => {
    assert.throws(() => check(mutated((variant) => delete variant[field])));
  });
}

test('validator rejects an empty variant source list', () => {
  assert.throws(() =>
    check(
      mutated((variant) => {
        variant.sources = [];
      }),
    ),
  );
});

test('validator rejects duplicate variant IDs within an entry', () => {
  const entry = mutated((variant, parent) => parent.variants.push(structuredClone(variant)));
  assert.throws(() => check(entry));
});

test('variant IDs are scoped to their parent entry', () => {
  assert.equal(entries[1].variants[0].id, entries[2].variants[0].id);
  assert.doesNotThrow(() =>
    validate(structuredClone(entries), [
      {
        slug: 'prayer',
        kind: 'prayer_recitation',
        readingMode: 'sequence',
        itemIds: entries.map((entry) => entry.id),
      },
    ]),
  );
});

test('variant virtues may reference their own sources', () => {
  const entry = mutated((variant) => {
    variant.virtues = [{ text: 'Validation fixture', sourceIds: [variant.sources[0].id] }];
  });
  assert.doesNotThrow(() => check(entry));
});

for (const reference of ['missing', 'parent', 'sibling']) {
  test(`validator rejects unsupported ${reference} source references in variant virtues`, () => {
    const entry = mutated((variant, parent) => {
      const sibling = structuredClone(variant);
      sibling.id = 'sibling-variant';
      sibling.sources[0].id = 'sibling-source';
      parent.variants.push(sibling);
      const sourceId =
        reference === 'parent'
          ? parent.sources[0].id
          : reference === 'sibling'
            ? sibling.sources[0].id
            : 'missing-source';
      variant.virtues = [{ text: 'Validation fixture', sourceIds: [sourceId] }];
    });
    assert.throws(() => check(entry));
  });
}

for (const repetitions of [0, -1, 1.5, '3', null]) {
  test(`validator rejects variant repetitions ${JSON.stringify(repetitions)}`, () => {
    assert.throws(() =>
      check(
        mutated((variant) => {
          variant.repetitions = repetitions;
        }),
      ),
    );
  });
}
