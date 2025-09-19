import { api } from '@/shared/api/base';
import type { PaginatedResponse } from '@/entities/product/model/types';
import type { Order } from '../model/types';

export const fetchOrders = async (): Promise<Order[]> => {
    const response = await api.get<PaginatedResponse<Order>>('/orders/');
    return response.data.results || [];
};