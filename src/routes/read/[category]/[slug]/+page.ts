import { error, redirect } from '@sveltejs/kit';

import { categories, readings } from '$lib/content';
import { resolveReading } from '$lib/content/resolve-reading.mjs';
import { canonicalSlug, previousSlugs } from '$lib/content/slugs';
import legacyRoutes from '$lib/content/legacy-routes.json';

export function entries() {
  return [
    ...legacyRoutes.map(({ category, slug }) => ({ category, slug })),
    ...categories.flatMap((category) =>
      category.items.flatMap((item) => {
        const slug = readings.find((entry) => entry.id === item.entryId)!.slug;
        return [slug, ...previousSlugs(slug)].map((slug) => ({ category: category.slug, slug }));
      }),
    ),
  ];
}

export function load({ params }: { params: { category: string; slug: string } }) {
  const category = categories.find((category) => category.slug === params.category);
  const slug = canonicalSlug(params.slug);
  const moved = legacyRoutes.find(
    (route) => route.category === params.category && route.slug === slug,
  );
  if (moved) redirect(308, '/read/' + moved.targetCategory + '/' + slug + '/');
  const entry = readings.find((entry) => entry.slug === slug);

  if (!category || !entry || !category.items.some((item) => item.entryId === entry.id)) {
    error(404, 'Bacaan tidak ditemukan');
  }

  if (params.slug !== slug) redirect(308, '/read/' + category.slug + '/' + slug + '/');

  return {
    category,
    entry: resolveReading(
      category.items.find((item) => item.entryId === entry.id)!,
      entry,
    ),
    index: category.items.findIndex((item) => item.entryId === entry.id),
  };
}
