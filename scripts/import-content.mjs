import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const root = '.content-source/data/dua-dhikr';

mkdirSync('src/lib/content/entries', { recursive: true });

mkdirSync('docs', { recursive: true });

copyFileSync('.content-source/LICENSE', 'docs/CONTENT-LICENSE.txt');

const readings = new Map();
const categories = [];

for (const [slug, title, description] of [
  [
    'morning',
    'Dzikir Pagi',
    'Awali hari dengan dzikir dan doa, memohon kebaikan serta perlindungan Allah.',
  ],
  [
    'evening',
    'Dzikir Petang',
    'Tutup hari dengan mengingat Allah, bersyukur dan memohon perlindungan-Nya.',
  ],
]) {
  const data = JSON.parse(readFileSync(`${root}/${slug}-dhikr/id.json`, 'utf8'));
  const itemIds = [];
  for (const [index, row] of data.entries()) {
    const id = createHash('sha256')
      .update(row.arabic + row.latin + row.translation + row.notes)
      .digest('hex')
      .slice(0, 12);
    itemIds.push(id);
    if (readings.has(id)) continue;
    const shortSlug =
      row.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-$/, '')
        .slice(0, 70) +
      '-' +
      id.slice(0, 4);
    const source = { id: `${id}-source`, type: 'hadith', label: row.source };
    let sources = [source];
    let virtues = [];
    if (['Al-Ikhlas', 'Al-Falaq', 'An-Naas'].includes(row.title)) {
      source.label = 'HR. Abu Dawud no. 5082';
      source.url = 'https://sunnah.com/abudawud:5082';
      const surah = { 'Al-Ikhlas': '112:1–4', 'Al-Falaq': '113:1–5', 'An-Naas': '114:1–6' }[
        row.title
      ];
      sources.push({ id: `${id}-quran`, type: 'quran', label: `QS. ${row.title} (${surah})` });
      virtues = [{ text: row.fawaid, sourceIds: [source.id] }];
    }
    if (row.title === 'Ayat al-Kursi')
      sources = [{ id: source.id, type: 'quran', label: 'QS. Al-Baqarah (2): 255' }];
    if (row.title === 'Sayyid al-Istighfar') {
      source.url = 'https://sunnah.com/bukhari:6306';
      virtues = [{ text: row.fawaid, sourceIds: [source.id] }];
    }
    const simple = /^Dibaca (\d+)x$/.exec(row.notes);
    const entry = {
      id,
      slug: shortSlug,
      type: 'dhikr',
      title: row.title,
      arabic: row.arabic,
      transliteration: row.latin,
      translation: row.translation,
      ...(simple ? { repetitions: Number(simple[1]) } : { notes: row.notes }),
      sources,
      virtues,
      order: index + 1,
    };
    if (row.title === 'Doa Memohon Kesehatan dan Perlindungan') {
      entry.repetitions = 3;
      source.url = 'https://sunnah.com/abudawud:5090';
    }
    readings.set(id, entry);
    writeFileSync(
      `src/lib/content/entries/${shortSlug}.json`,
      JSON.stringify(entry, null, 2) + '\n',
    );
  }
  categories.push({ id: slug, slug, title, description, itemIds });
}

writeFileSync('src/lib/content/categories.json', JSON.stringify(categories, null, 2) + '\n');

console.log(
  `Imported ${readings.size} unique readings; ${categories.map((c) => c.slug + ': ' + c.itemIds.length).join(', ')}`,
);
