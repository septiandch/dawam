export interface SourceReference {
  id: string;
  type: 'hadith' | 'quran' | 'book' | 'other';
  label: string;
  url?: string;
}

export interface ReadingEntry {
  id: string;
  slug: string;
  type: 'dhikr' | 'dua' | 'prayer_recitation';
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  repetitions?: number;
  sources: SourceReference[];
  virtues: { text: string; sourceIds: string[] }[];
  notes?: string;
  order: number;
}

export interface Category {
  id: string;
  slug: string;
  title: string;
  description: string;
  itemIds: string[];
}
