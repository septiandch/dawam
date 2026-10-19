import { error } from '@sveltejs/kit';

import { categories, readings } from '$lib/content';

export function entries() {
  return categories.flatMap((category) =>
    category.itemIds.map((id) => ({
      category: category.slug,
      slug: readings.find((entry) => entry.id === id)!.slug,
    })),
  );
}

export function load({ params }: { params: { category: string; slug: string } }) {
  const category = categories.find((category) => category.slug === params.category);
  const entry = readings.find((entry) => entry.slug === params.slug);

  if (!category || !entry || !category.itemIds.includes(entry.id)) {
    error(404, 'Bacaan tidak ditemukan');
  }

  return { category, entry, index: category.itemIds.indexOf(entry.id) };
}
