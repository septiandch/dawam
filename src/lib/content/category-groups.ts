import type { Category } from '$lib/types/content';

export const categoryGroups: { kind: Category['kind']; title: string }[] = [
  { kind: 'dhikr', title: 'Dzikir' },
  { kind: 'dua', title: "Do'a" },
  { kind: 'prayer_recitation', title: 'Bacaan Shalat' },
];
