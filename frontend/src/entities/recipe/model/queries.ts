import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import * as recipeApi from '../api/recipeApi';

const recipeKeys = {
  all: ['recipes'] as const,
  lists: (filters: string, search: string, ordering: string) => [...recipeKeys.all, 'list', filters, search, ordering] as const,
  details: (slug: string) => [...recipeKeys.all, 'detail', slug] as const,
  
  categories: ['recipeCategories'] as const,
  tags: ['recipeTags'] as const,
};

interface UseRecipesOptions {
  filters?: string;
  search?: string;
  ordering?: string;
}

export const useRecipes = ({ filters = '', search = '', ordering = '' }: UseRecipesOptions) => useInfiniteQuery({
  queryKey: recipeKeys.lists(filters, search, ordering),
  queryFn: ({ pageParam }) => recipeApi.fetchRecipes({ pageParam: pageParam as number, filters, search, ordering }),
  getNextPageParam: (lastPage) => {
    if (!lastPage.next) return undefined;
    try {
      const url = new URL(lastPage.next);
      const nextPage = url.searchParams.get('page');
      return nextPage ? parseInt(nextPage, 10) : undefined;
    } catch (e) { return undefined; }
  },
  initialPageParam: 1,
  staleTime: 5 * 60 * 1000,
});

export const useRecipe = (slug: string) => useQuery({
  queryKey: recipeKeys.details(slug),
  queryFn: () => recipeApi.fetchRecipeBySlug(slug),
  enabled: !!slug,
  staleTime: 5 * 60 * 1000,
});

export const useRecipeCategories = () => useQuery({
  queryKey: recipeKeys.categories,
  queryFn: recipeApi.fetchRecipeCategories,
  staleTime: Infinity,
});

export const useRecipeTags = () => useQuery({
  queryKey: recipeKeys.tags,
  queryFn: recipeApi.fetchRecipeTags,
  staleTime: Infinity,
});