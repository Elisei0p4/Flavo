import { useQuery } from '@tanstack/react-query';
import * as orderApi from '../api/orderApi';

const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
};

export const useOrders = () => useQuery({
  queryKey: orderKeys.lists(),
  queryFn: orderApi.fetchOrders,
});