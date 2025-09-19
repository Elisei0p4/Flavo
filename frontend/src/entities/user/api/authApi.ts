import { api } from '@/shared/api/base';
import type { User, AuthTokens, RegisterData } from '../model/types';

export const loginUser = async (credentials: { username: string; password: string }): Promise<AuthTokens> => {
  const { data } = await api.post<AuthTokens>('/auth/token/', credentials);
  return data;
};

export const registerUser = async (userData: RegisterData): Promise<void> => {
  await api.post('/auth/register/', userData);
};

export const fetchCurrentUser = async (): Promise<User> => {
  const { data } = await api.get<User>('/users/me/');
  return data;
};

export const refreshAuthToken = async (refreshToken: string): Promise<{ access: string }> => {
  const { data } = await api.post<{ access: string }>('/auth/token/refresh/', { refresh: refreshToken });
  return data;
};