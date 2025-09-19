import { useQuery } from '@tanstack/react-query';
import * as productApi from '../api/productApi';
import { keepPreviousData } from '@tanstack/react-query';

const productKeys = {
  all: ['products'] as const,
  lists: (filters: string, page: number) => [...productKeys.all, 'list', filters, page] as const,
  details: (slug: string) => [...productKeys.all, 'detail', slug] as const,
  
  collections: ['collections'] as const,
  collection: (slug: string) => [...productKeys.collections, slug] as const,

  tags: ['tags'] as const,
  categories: ['categories'] as const,
};

export const useProducts = (page: number, filters: string) => useQuery({
  queryKey: productKeys.lists(filters, page),
  queryFn: () => productApi.fetchProducts({ page, filters }),
  staleTime: 5 * 60 * 1000,
  placeholderData: keepPreviousData,
});

export const useProduct = (slug: string) => useQuery({
  queryKey: productKeys.details(slug),
  queryFn: () => productApi.fetchProductBySlug(slug),
  enabled: !!slug,
  staleTime: 5 * 60 * 1000,
});

export const useTags = () => useQuery({
  queryKey: productKeys.tags,
  queryFn: productApi.fetchTags,
  staleTime: Infinity,
});

export const useCategories = () => useQuery({
    queryKey: productKeys.categories,
    queryFn: productApi.fetchCategories,
    staleTime: Infinity,
});

export const useCollections = () => useQuery({
  queryKey: productKeys.collections,
  queryFn: productApi.fetchCollections,
  staleTime: Infinity,
});