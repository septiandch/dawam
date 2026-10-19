import { readFileSync, readdirSync } from 'node:fs';
import assert from 'node:assert/strict';

function validateText(content) {
  for (const field of ['arabic', 'transliteration', 'translation'])
    assert(typeof content[field] === 'string' && content[field].trim(), `Missing ${field}`);
  assert(content.notes === undefined || typeof content.notes === 'string', 'Invalid notes');
  assert(
    content.readingInstruction === undefined ||
      (typeof content.readingInstruction === 'string' && content.readingInstruction.trim()),
    'Invalid reading instruction',
  );
  assert(
    content.repetitions === undefined ||
      (Number.isInteger(content.repetitions) && content.repetitions > 0),
    'Invalid repetitions',
  );
  assert(Array.isArray(content.sources) && content.sources.length > 0, 'Source required');
  const sourceIds = new Set();
  for (const source of content.sources) {
    assert(
      typeof source.id === 'string' && source.id.trim() && !sourceIds.has(source.id),
      'Invalid source id',
    );
    sourceIds.add(source.id);
    assert(typeof source.label === 'string' && source.label.trim(), 'Source label required');
    assert(['hadith', 'quran', 'book', 'other'].includes(source.type), 'Invalid source type');
  }
  assert(Array.isArray(content.virtues), 'Virtues must be an array');
  for (const virtue of content.virtues)
    assert(
      typeof virtue.text === 'string' &&
        virtue.text.trim() &&
        Array.isArray(virtue.sourceIds) &&
        virtue.sourceIds.length &&
        virtue.sourceIds.every((id) => sourceIds.has(id)),
      'Virtue requires supporting sources',
    );
}

export function validate(readings, categories) {
  const ids = new Set();
  const slugs = new Set();
  for (const entry of readings) {
    for (const field of ['id', 'slug', 'type', 'title', 'arabic', 'transliteration', 'translation'])
      assert.equal(
        typeof entry[field] === 'string' && entry[field].trim().length > 0,
        true,
        `${entry.id}: missing ${field}`,
      );
    assert(!ids.has(entry.id), `Duplicate id ${entry.id}`);
    ids.add(entry.id);
    assert(!slugs.has(entry.slug), `Duplicate slug ${entry.slug}`);
    slugs.add(entry.slug);
    assert(['dhikr', 'dua', 'prayer_recitation'].includes(entry.type));
    assert(Number.isInteger(entry.order) && entry.order > 0);
    validateText(entry);
    if (entry.defaultVersionLabel !== undefined)
      assert(
        typeof entry.defaultVersionLabel === 'string' && entry.defaultVersionLabel.trim(),
        'Invalid default version label',
      );
    if (entry.variants !== undefined) {
      assert(Array.isArray(entry.variants), 'Variants must be an array');
      const variantIds = new Set(['default']);
      for (const variant of entry.variants) {
        assert(
          typeof variant.id === 'string' && variant.id.trim() && !variantIds.has(variant.id),
          'Invalid variant id',
        );
        variantIds.add(variant.id);
        assert(typeof variant.label === 'string' && variant.label.trim(), 'Variant label required');
        validateText(variant);
      }
    }
  }
  assert.equal(new Set(categories.map((c) => c.slug)).size, categories.length);
  for (const category of categories) {
    assert(category.itemIds.length > 0);
    assert.equal(new Set(category.itemIds).size, category.itemIds.length);
    for (const id of category.itemIds) assert(ids.has(id), `Missing reading ${id}`);
    assert(['sequence', 'single'].includes(category.readingMode), 'Invalid reading mode');
    assert(['dhikr', 'dua', 'prayer_recitation'].includes(category.kind), 'Invalid category kind');
    for (const id of category.itemIds)
      assert.equal(
        readings.find((entry) => entry.id === id).type,
        category.kind,
        'Category type mismatch',
      );
  }
}

const readings = readdirSync('src/lib/content/entries')
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(`src/lib/content/entries/${f}`, 'utf8')));
const categories = JSON.parse(readFileSync('src/lib/content/categories.json', 'utf8'));

validate(readings, categories);

console.log(
  `Content validation passed: ${readings.length} entries, ${categories.length} categories.`,
);
