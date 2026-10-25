import type { Category } from '$lib/types/content';

export const categoryGroups: { kind: Category['kind']; title: string }[] = [
  { kind: 'dhikr', title: 'Dzikir' },
  { kind: 'prayer_recitation', title: 'Bacaan Shalat' },
  { kind: 'dua', title: "Do'a" },
];
