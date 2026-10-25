import { error } from '@sveltejs/kit';

import { categories, readings } from '$lib/content';
import { resolveReading } from '$lib/content/resolve-reading.mjs';

export function entries() {
  return categories.map((category) => ({ category: category.slug }));
}

export function load({ params }: { params: { category: string } }) {
  const category = categories.find((category) => category.slug === params.category);

  if (!category) {
    error(404, 'Kategori tidak ditemukan');
  }

  return {
    category,
    entries: category.items.map((item) =>
      resolveReading(
        item,
        readings.find((reading) => reading.id === item.entryId)!,
      ),
    ),
  };
}
