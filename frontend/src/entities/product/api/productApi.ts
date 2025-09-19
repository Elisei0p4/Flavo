import { api } from '@/shared/api/base';
import type { PaginatedResponse, Product, Tag, Collection, CollectionDetail, Category } from '../model/types';


export const fetchProducts = async ({ page = 1, filters = '' }): Promise<PaginatedResponse<Product>> => {
  const { data } = await api.get<PaginatedResponse<Product>>(`/products/?page=${page}&${filters}`);
  return data;
};


export const fetchProductBySlug = async (productSlug: string): Promise<Product> => {
  const { data } = await api.get<Product>(`/products/${productSlug}/`);
  return data;
};

export const fetchTags = async (): Promise<Tag[]> => {
  const { data } = await api.get<PaginatedResponse<Tag>>('/tags/');
  return data.results;
};

export const fetchCollections = async (): Promise<Collection[]> => {
  const { data } = await api.get<PaginatedResponse<Collection>>('/collections/');
  return data.results;
};


export const fetchCategories = async (): Promise<Category[]> => {
    const { data } = await api.get<PaginatedResponse<Category>>('/categories/');
    return data.results;
};

export const fetchCollectionBySlug = async (slug: string): Promise<CollectionDetail> => {
  const { data } = await api.get<CollectionDetail>(`/collections/${slug}/`);
  return data;
}