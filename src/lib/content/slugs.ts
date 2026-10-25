import legacySlugs from './legacy-slugs.json';

const aliases: Record<string, string> = legacySlugs;

export function canonicalSlug(slug: string): string {
  return aliases[slug] ?? slug;
}

export function previousSlugs(slug: string): string[] {
  return Object.keys(aliases).filter((alias) => aliases[alias] === slug);
}
