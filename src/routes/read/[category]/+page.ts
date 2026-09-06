import { error } from '@sveltejs/kit';

import { categories, readings } from '$lib/content';

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
    entries: category.itemIds.map((id) => readings.find((reading) => reading.id === id)!),
  };
}
