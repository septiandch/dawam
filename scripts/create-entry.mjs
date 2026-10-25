/** Convert an imported recitation into the same schema used by curated entries. */
export function createEntry(entry) {
  return {
    schemaVersion: 1,
    id: entry.id,
    slug: entry.slug,
    type: entry.type,
    title: entry.title,
    text: {
      arabic: entry.arabic,
      transliteration: entry.transliteration,
      translation: entry.translation,
    },
    defaultVariantId: 'default',
    variants: [
      {
        id: 'default',
        label: 'Versi utama',
        title: entry.title,
        text: null,
        repetitions: entry.repetitions ?? null,
        readingInstruction: entry.readingInstruction ?? '',
        notes: entry.notes ?? '',
        sources: entry.sources.map((source) => ({
          id: source.id,
          type: source.type,
          label: source.label,
          url: source.url ?? null,
        })),
        virtues: entry.virtues,
        alternativeIds: [],
      },
    ],
  };
}

export function entryFilename(entry, context) {
  const special = {
    'Al-Ikhlas': 'surah_al_ikhlas',
    'Al-Falaq': 'surah_al_falaq',
    'An-Naas': 'surah_an_nas',
    'Ayat Kursi': 'ayat_kursi',
  };
  if (special[entry.title]) return special[entry.title] + '.json';
  let stem = entry.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
  if (!/^(doa|dzikir|shalat)_/.test(stem)) stem = 'dzikir_' + stem;
  const words = stem.split('_');
  const skip = new Set([
    'memohon',
    'memasuki',
    'kepada',
    'dengan',
    'dari',
    'dan',
    'di',
    'atas',
    'yang',
    'agar',
    'semua',
  ]);
  const body = words.slice(1).filter((word) => !skip.has(word));
  return [words[0], ...body.slice(0, 2), context].join('_') + '.json';
}
