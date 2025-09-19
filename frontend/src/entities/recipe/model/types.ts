import type { components } from '@/api/schema';


export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type Recipe = components['schemas']['Recipe'];
export type RecipeCategory = components['schemas']['RecipeCategory'];
export type RecipeTag = components['schemas']['RecipeTag'];

export type RecipeDifficulty = components['schemas']['DifficultyEnum']; 