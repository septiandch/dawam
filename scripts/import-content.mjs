import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  copyFileSync,
  readdirSync,
  existsSync,
} from 'node:fs';
import { createHash } from 'node:crypto';
import { createEntry, entryFilename } from './create-entry.mjs';

const root = '.content-source/data/dua-dhikr';

mkdirSync('src/lib/content/entries', { recursive: true });

mkdirSync('docs', { recursive: true });

copyFileSync('.content-source/LICENSE', 'docs/CONTENT-LICENSE.txt');

const readings = new Map();
const categoriesPath = 'src/lib/content/categories.json';
// Existing content is authoritative, including manual corrections and curated collections.
const categories = existsSync(categoriesPath)
  ? JSON.parse(readFileSync(categoriesPath, 'utf8'))
  : [];
const existingIds = new Set();
const existingSlugs = new Set();
for (const file of readdirSync('src/lib/content/entries').filter((file) =>
  file.endsWith('.json'),
)) {
  const entry = JSON.parse(readFileSync(`src/lib/content/entries/${file}`, 'utf8'));
  existingIds.add(entry.id);
  existingSlugs.add(entry.slug);
}

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
    if (row.title === 'Ayat Kursi') {
      const virtueSource = {
        id: `${id}-virtue-source`,
        type: 'hadith',
        label:
          'HR. al-Hakim 1/562; dinilai sahih oleh al-Albani dalam Shahih at-Targhib wa at-Tarhib 1/273, sebagaimana dirujuk dalam Hisn al-Muslim no. 75',
        url: 'https://sunnah.com/hisn:75',
      };
      sources = [{ id: source.id, type: 'quran', label: 'QS. Al-Baqarah (2): 255' }, virtueSource];
      virtues = [
        {
          text: 'Membaca Ayat Kursi pada pagi hari menjadi sebab perlindungan dari jin hingga petang, dan membacanya pada petang hari menjadi sebab perlindungan dari jin hingga pagi.',
          sourceIds: [virtueSource.id],
        },
      ];
    }
    if (row.title === 'Sayyidul Istighfar') {
      source.url = 'https://sunnah.com/bukhari:6306';
      virtues = [{ text: row.fawaid, sourceIds: [source.id] }];
    }
    if (row.title === 'Tasbih dan Tahmid Harian') {
      source.label = 'HR. Muslim no. 2692';
      source.url = 'https://sunnah.com/muslim:2692';
      const dailySource = {
        id: `${id}-daily-source`,
        type: 'hadith',
        label: 'HR. al-Bukhari no. 6405',
        url: 'https://sunnah.com/bukhari:6405',
      };
      sources = [source, dailySource];
      virtues = [
        {
          text: 'Barang siapa membaca Subhanallahi wa bihamdihi 100 kali pada pagi dan petang, tidak ada seorang pun pada hari kiamat yang membawa amalan lebih utama daripada yang dibawanya, kecuali orang yang membaca sebanyak itu atau lebih.',
          sourceIds: [source.id],
        },
        {
          text: 'Barang siapa membaca Subhanallahi wa bihamdihi 100 kali dalam sehari, dosa-dosanya dihapus meskipun sebanyak buih laut.',
          sourceIds: [dailySource.id],
        },
      ];
    }
    if (row.title === 'Dzikir Tauhid') {
      source.url = 'https://www.hadits.id/hadits/bukhari/3293';
      virtues = [
        {
          text: 'Membaca dzikir ini 100 kali dalam sehari mendatangkan pahala setara memerdekakan sepuluh budak, dicatatkan seratus kebaikan, dan dihapuskan seratus keburukan. Bacaan ini juga menjadi perlindungan dari setan pada hari itu hingga petang. Tidak ada yang membawa amalan lebih utama daripada itu, kecuali orang yang beramal lebih banyak.',
          sourceIds: [source.id],
        },
      ];
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
      ...(simple
        ? { repetitions: Number(simple[1]) }
        : row.notes.startsWith('Dibaca ')
          ? { readingInstruction: row.notes }
          : { notes: row.notes }),
      sources,
      virtues,
      order: index + 1,
    };
    if (row.title === 'Doa Memohon Kesehatan dan Perlindungan') {
      entry.repetitions = 3;
      source.url = 'https://sunnah.com/abudawud:5090';
    }
    readings.set(id, entry);
    if (!existingIds.has(id)) {
      const filename = entryFilename(entry, slug);
      const canonicalSlug = filename.slice(0, -5).replaceAll('_', '-');
      if (existingSlugs.has(canonicalSlug)) {
        throw new Error(`Refusing to replace existing reading slug: ${canonicalSlug}`);
      }
      writeFileSync(
        `src/lib/content/entries/${filename}`,
        JSON.stringify(createEntry({ ...entry, slug: canonicalSlug }), null, 2) + '\n',
        { flag: 'wx' },
      );
      existingIds.add(id);
      existingSlugs.add(canonicalSlug);
    }
  }
  const existingIndex = categories.findIndex((category) => category.slug === slug);
  if (existingIndex === -1) {
    categories.push({
      id: slug,
      slug,
      title,
      description,
      shortDescription: `Bacaan dzikir di waktu ${slug === 'morning' ? 'pagi' : 'petang'}.`,
      icon: slug === 'morning' ? 'sun' : 'sunset',
      kind: 'dhikr',
      readingMode: 'sequence',
      items: itemIds.map((entryId) => ({ entryId, variantId: 'default' })),
    });
  } else {
    // Supply metadata for legacy categories without replacing edited membership or text.
    categories[existingIndex] = {
      icon: slug === 'morning' ? 'sun' : 'sunset',
      shortDescription: `Bacaan dzikir di waktu ${slug === 'morning' ? 'pagi' : 'petang'}.`,
      kind: 'dhikr',
      readingMode: 'sequence',
      ...categories[existingIndex],
    };
  }
}

writeFileSync(categoriesPath, JSON.stringify(categories, null, 2) + '\n');

console.log(
  `Processed ${readings.size} unique source readings (existing files preserved); ${categories.map((c) => c.slug + ': ' + c.items.length).join(', ')}`,
);
