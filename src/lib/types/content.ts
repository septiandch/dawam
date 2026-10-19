export interface SourceReference {
  id: string;
  type: 'hadith' | 'quran' | 'book' | 'other';
  label: string;
  url?: string;
}

export interface ReadingText {
  arabic: string;
  transliteration: string;
  translation: string;
  repetitions?: number;
  sources: SourceReference[];
  virtues: { text: string; sourceIds: string[] }[];
  notes?: string;
  readingInstruction?: string;
}

export interface ReadingVariant extends ReadingText {
  id: string;
  label: string;
}

export interface ReadingEntry extends ReadingText {
  id: string;
  slug: string;
  type: 'dhikr' | 'dua' | 'prayer_recitation';
  title: string;
  order: number;
  defaultVersionLabel?: string;
  variants?: ReadingVariant[];
}

export interface Category {
  icon: 'sun' | 'sunset' | 'prayer-hands' | 'book-open';
  kind: ReadingEntry['type'];
  readingMode: 'sequence' | 'single';
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  itemIds: string[];
}
