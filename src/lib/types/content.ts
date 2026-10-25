export interface SourceReference {
  id: string;
  type: 'hadith' | 'quran' | 'book' | 'other';
  label: string;
  url?: string | null;
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

export interface RecitationText {
  arabic: string;
  transliteration: string;
  translation: string;
}

export interface StoredVariant {
  id: string;
  label: string;
  title: string;
  text: RecitationText | null;
  repetitions: number | null;
  readingInstruction: string;
  notes: string;
  sources: SourceReference[];
  virtues: ReadingText['virtues'];
  alternativeIds: string[];
}

export interface ReadingRecord {
  schemaVersion: 1;
  id: string;
  slug: string;
  type: 'dhikr' | 'dua' | 'prayer_recitation';
  title: string;
  text: RecitationText;
  defaultVariantId: string;
  variants: StoredVariant[];
}

export interface CategoryItem {
  entryId: string;
  variantId: string;
}

export interface ReadingEntry extends ReadingText {
  id: string;
  slug: string;
  type: 'dhikr' | 'dua' | 'prayer_recitation';
  title: string;
  variantId: string;
  defaultVersionLabel: string;
  variants: ReadingVariant[];
}

export interface Category {
  icon: 'sun' | 'sunset' | 'moon' | 'prayer-hands' | 'book-open';
  kind: ReadingEntry['type'];
  readingMode: 'sequence' | 'single';
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  items: CategoryItem[];
}
