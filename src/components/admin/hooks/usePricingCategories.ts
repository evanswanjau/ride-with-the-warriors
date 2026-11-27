import type { PricingCategory } from '../../../types';
import { adminApi } from '../api/adminApi';
import { useLoad } from './useLoad';

/** Pricing categories (names, colours, bib ranges) for one event year. */
export function usePricingCategories(year?: number) {
    const loaded = useLoad(() => adminApi.pricingCategories(year), String(year ?? ''), 'Failed to load pricing');
    const categories: PricingCategory[] = loaded.data?.categories ?? [];
    return { ...loaded, categories };
}
