import type { components } from '@/api/schema';

export type User = components['schemas']['User'];

export interface AuthTokens {
  access: string;
  refresh: string;
}

export type RegisterData = components['schemas']['Register'];