import categoryData from './categories.json';

import type { Category, ReadingRecord } from '$lib/types/content';

const modules = import.meta.glob('./entries/*.json', { eager: true, import: 'default' });
export const readings = Object.values(modules) as ReadingRecord[];
export const categories = categoryData as Category[];
