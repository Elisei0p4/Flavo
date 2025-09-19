import type { Product } from '@/entities/product';


export type CartItem = Product & {
  quantity: number;
};