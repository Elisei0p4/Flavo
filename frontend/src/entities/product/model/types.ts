import type { components } from '@/api/schema';

export type Product = components['schemas']['Product'];
export type Tag = components['schemas']['Tag'];
export type Category = components['schemas']['Category'];
export type Collection = components['schemas']['Collection'];
export type CollectionDetail = components['schemas']['CollectionDetail'];


export type Recipe = components['schemas']['Recipe'];
export type RecipeCategory = components['schemas']['RecipeCategory'];
export type RecipeTag = components['schemas']['RecipeTag'];

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}