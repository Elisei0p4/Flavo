import { api } from '@/shared/api/base';
import type { PaginatedResponse, Recipe, RecipeCategory, RecipeTag } from '../model/types'; 

interface FetchRecipesParams {
  pageParam?: number;
  filters?: string;
  search?: string;
  ordering?: string;
}

export const fetchRecipes = async ({ 
  pageParam = 1, 
  filters = '', 
  search = '', 
  ordering = '' 
}: FetchRecipesParams): Promise<PaginatedResponse<Recipe>> => {
  const queryParams = new URLSearchParams(filters);
  queryParams.set('page', String(pageParam));
  if (search) queryParams.set('search', search);
  if (ordering) queryParams.set('ordering', ordering);

  const { data } = await api.get<PaginatedResponse<Recipe>>(`/recipes/?${queryParams.toString()}`);
  return data;
};

export const fetchRecipeBySlug = async (recipeSlug: string): Promise<Recipe> => {
  const { data } = await api.get<Recipe>(`/recipes/${recipeSlug}/`);
  return data;
};

export const fetchRecipeCategories = async (): Promise<RecipeCategory[]> => {
  const { data } = await api.get<PaginatedResponse<RecipeCategory>>('/recipe-categories/');
  return data.results;
};

export const fetchRecipeTags = async (): Promise<RecipeTag[]> => {
  const { data } = await api.get<PaginatedResponse<RecipeTag>>('/recipe-tags/');
  return data.results;
};