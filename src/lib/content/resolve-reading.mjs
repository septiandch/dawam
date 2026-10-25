/**
 * Resolve an explicitly selected variant; categories never override entry content.
 * @param {import('../types/content').CategoryItem} item
 * @param {import('../types/content').ReadingRecord} entry
 * @returns {import('../types/content').ReadingEntry}
 */
export function resolveReading(item, entry) {
  const selected = entry.variants.find((variant) => variant.id === item.variantId);
  if (item.entryId !== entry.id || !selected)
    throw new Error(`Unknown variant ${entry.id}:${item.variantId}`);
  /** @param {import('../types/content').StoredVariant} variant */
  const content = (variant) => ({
    ...(variant.text ?? entry.text),
    repetitions: variant.repetitions ?? undefined,
    readingInstruction: variant.readingInstruction || undefined,
    notes: variant.notes || undefined,
    sources: variant.sources,
    virtues: variant.virtues,
  });
  return {
    id: entry.id,
    slug: entry.slug,
    type: entry.type,
    title: selected.title,
    variantId: selected.id,
    ...content(selected),
    defaultVersionLabel: selected.label,
    variants: selected.alternativeIds.map((id) => {
      const variant = entry.variants.find((variant) => variant.id === id);
      if (!variant) throw new Error(`Unknown alternative ${entry.id}:${id}`);
      return { id: variant.id, label: variant.label, ...content(variant) };
    }),
  };
}
