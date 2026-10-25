import { readFileSync, readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';

const entryKeys = [
  'schemaVersion',
  'id',
  'slug',
  'type',
  'title',
  'text',
  'defaultVariantId',
  'variants',
];
const variantKeys = [
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
];
function keys(value, expected, label) {
  assert(value && typeof value === 'object' && !Array.isArray(value), `Invalid ${label}`);
  assert.deepEqual(Object.keys(value).sort(), [...expected].sort(), `Invalid ${label} fields`);
}
const nonempty = (value, label) =>
  assert(typeof value === 'string' && value.trim(), `Missing ${label}`);
function text(value) {
  keys(value, ['arabic', 'transliteration', 'translation'], 'text');
  for (const field of ['arabic', 'transliteration', 'translation']) nonempty(value[field], field);
}
export function validate(readings, categories) {
  const ids = new Set();
  const slugs = new Set();
  for (const entry of readings) {
    keys(entry, entryKeys, 'entry');
    assert.equal(entry.schemaVersion, 1, 'Invalid schema version');
    for (const field of ['id', 'slug', 'title', 'defaultVariantId']) nonempty(entry[field], field);
    assert(
      /^(surah|ayat|doa|dzikir|shalat)-[a-z0-9]+(?:-[a-z0-9]+){0,2}$/.test(entry.slug),
      `Invalid or lengthy slug ${entry.slug}`,
    );
    assert(!ids.has(entry.id), `Duplicate id ${entry.id}`);
    assert(!slugs.has(entry.slug), `Duplicate slug ${entry.slug}`);
    ids.add(entry.id);
    slugs.add(entry.slug);
    assert(['dhikr', 'dua', 'prayer_recitation'].includes(entry.type), 'Invalid entry type');
    text(entry.text);
    assert(Array.isArray(entry.variants) && entry.variants.length, 'Variants required');
    const variants = new Set();
    for (const variant of entry.variants) {
      keys(variant, variantKeys, 'variant');
      for (const field of ['id', 'label', 'title']) nonempty(variant[field], `variant ${field}`);
      assert(!variants.has(variant.id), 'Duplicate variant id');
      variants.add(variant.id);
      if (variant.text !== null) text(variant.text);
      assert(
        variant.repetitions === null ||
          (Number.isInteger(variant.repetitions) && variant.repetitions > 0),
        'Invalid repetitions',
      );
      for (const field of ['readingInstruction', 'notes'])
        assert.equal(typeof variant[field], 'string', `Invalid ${field}`);
      assert(Array.isArray(variant.sources) && variant.sources.length, 'Sources required');
      const sourceIds = new Set();
      for (const source of variant.sources) {
        keys(source, ['id', 'type', 'label', 'url'], 'source');
        nonempty(source.id, 'source id');
        nonempty(source.label, 'source label');
        assert(!sourceIds.has(source.id), 'Duplicate source id');
        sourceIds.add(source.id);
        assert(['hadith', 'quran', 'book', 'other'].includes(source.type), 'Invalid source type');
        assert(
          source.url === null ||
            (typeof source.url === 'string' && /^https?:\/\//.test(source.url)),
          'Invalid source URL',
        );
      }
      assert(Array.isArray(variant.virtues), 'Virtues required');
      for (const virtue of variant.virtues) {
        keys(virtue, ['text', 'sourceIds'], 'virtue');
        nonempty(virtue.text, 'virtue text');
        assert(
          Array.isArray(virtue.sourceIds) &&
            virtue.sourceIds.length &&
            virtue.sourceIds.every((id) => sourceIds.has(id)),
          'Virtue requires supporting sources',
        );
      }
      assert(Array.isArray(variant.alternativeIds), 'Alternative IDs required');
      assert.equal(
        new Set(variant.alternativeIds).size,
        variant.alternativeIds.length,
        'Duplicate alternative',
      );
      assert(!variant.alternativeIds.includes(variant.id), 'Variant cannot reference itself');
    }
    assert(variants.has(entry.defaultVariantId), 'Missing default variant');
    for (const variant of entry.variants)
      for (const id of variant.alternativeIds)
        assert(variants.has(id), `Missing alternative ${id}`);
  }
  assert.equal(
    new Set(categories.map((category) => category.slug)).size,
    categories.length,
    'Duplicate category',
  );
  for (const category of categories) {
    assert(
      !('itemIds' in category) && !('itemOverrides' in category),
      'Legacy category fields are not supported',
    );
    for (const field of ['id', 'slug', 'title', 'description', 'shortDescription'])
      nonempty(category[field], `category ${field}`);
    assert(['dhikr', 'dua', 'prayer_recitation'].includes(category.kind), 'Invalid category kind');
    assert(['sequence', 'single'].includes(category.readingMode), 'Invalid reading mode');
    assert(
      ['sun', 'sunset', 'moon', 'prayer-hands', 'book-open'].includes(category.icon),
      'Invalid category icon',
    );
    assert(Array.isArray(category.items) && category.items.length, 'Category items required');
    assert.equal(
      new Set(category.items.map((item) => item.entryId)).size,
      category.items.length,
      'Duplicate category entry',
    );
    for (const item of category.items) {
      keys(item, ['entryId', 'variantId'], 'category item');
      const entry = readings.find((entry) => entry.id === item.entryId);
      assert(entry, `Missing reading ${item.entryId}`);
      assert(
        entry.variants.some((variant) => variant.id === item.variantId),
        `Missing variant ${item.variantId}`,
      );
    }
  }
}

export function validateDirectory() {
  const files = readdirSync('src/lib/content/entries').filter((file) => file.endsWith('.json'));
  for (const file of files)
    assert(
      /^(surah|ayat|doa|dzikir|shalat)_[a-z0-9]+(?:_[a-z0-9]+)*\.json$/.test(file),
      `Invalid entry filename ${file}`,
    );
  const readings = files.map((file) => {
    assert(file.slice(0, -5).split('_').length <= 4, `Entry filename exceeds four words: ${file}`);
    const entry = JSON.parse(readFileSync(`src/lib/content/entries/${file}`, 'utf8'));
    assert.equal(
      entry.slug,
      file.slice(0, -5).replaceAll('_', '-'),
      `Filename and slug differ: ${file}`,
    );
    return entry;
  });
  const categories = JSON.parse(readFileSync('src/lib/content/categories.json', 'utf8'));
  validate(readings, categories);
  const aliases = JSON.parse(readFileSync('src/lib/content/legacy-slugs.json', 'utf8'));
  const currentSlugs = new Set(readings.map((entry) => entry.slug));
  for (const [alias, target] of Object.entries(aliases)) {
    assert(!currentSlugs.has(alias), `Legacy slug conflicts with a current slug: ${alias}`);
    assert(currentSlugs.has(target), `Missing legacy slug target: ${target}`);
  }
  return { readings, categories };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { readings, categories } = validateDirectory();
  console.log(
    `Content validation passed: ${readings.length} entries, ${categories.length} categories.`,
  );
}
