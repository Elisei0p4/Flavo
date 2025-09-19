import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSync, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

import { api } from '@/shared/api/base';
import { TableRowSkeleton } from '@/shared/ui/Skeleton';
import { Button } from '@/shared/ui/Button';
import { getErrorMessage } from '@/shared/lib/errorHandler';
import { formatMoneyInteger } from '@/shared/lib/money';
import type { components } from '@/api/schema';
import { useAuthStore } from '@/entities/user';

type ManagerOrder = components['schemas']['ManagerOrder'];
type OrderStatus = components['schemas']['StatusEnum'];

interface PaginatedManagerOrderList {
  count: number;
  next: string | null;
  previous: string | null;
  results: ManagerOrder[];
}

const allOrderStatuses: OrderStatus[] = [
  "PENDING", "PREPARING", "DELIVERING", "COMPLETED", "CANCELLED",
];

const fetchManagerOrders = async (page: number): Promise<PaginatedManagerOrderList> => {
  const response = await api.get<PaginatedManagerOrderList>(`/dashboard/orders/?page=${page}`);
  return response.data;
};

const updateOrderStatus = async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
  const response = await api.patch<components['schemas']['ManagerOrderUpdate']>(`/dashboard/orders/${orderId}/`, { status });
  return response.data;
};

const statusDisplay: Record<OrderStatus, string> = {
  PENDING: 'Ожидает',
  PREPARING: 'Готовится',
  DELIVERING: 'Доставляется',
  COMPLETED: 'Доставлен',
  CANCELLED: 'Отменен',
};

const statusColors: Record<OrderStatus, string> = {
  PENDING: 'text-yellow-400',
  PREPARING: 'text-blue-400',
  DELIVERING: 'text-purple-400',
  COMPLETED: 'text-green-400',
  CANCELLED: 'text-red-400',
};

const OrderRow: React.FC<{ order: ManagerOrder }> = ({ order }) => {
  const queryClient = useQueryClient();
  const [showDetails, setShowDetails] = useState(false);

  const mutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managerOrders'] });
      toast.success('Статус заказа обновлен!');
    },
    onError: (error) => {
      toast.error(`Ошибка: ${getErrorMessage(error)}`);
    },
  });

  const handleStatusChange = (newStatus: OrderStatus) => {
    mutation.mutate({ orderId: order.id, status: newStatus });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="vintage-card-dark p-4 mb-4 border border-accent-gold/20 flex flex-col rounded-lg"
    >
      <div className="flex flex-wrap items-center justify-between text-text-light/80 text-sm md:text-base">
        <p className="font-heading text-lg text-text-light w-full md:w-auto mb-2 md:mb-0">ID: {order.id?.substring(0, 8)}...</p>
        <p className="w-full md:w-auto mb-2 md:mb-0">Клиент: {order.customer}</p>
        <p className="w-full md:w-auto mb-2 md:mb-0">Дата: {new Date(order.created_at).toLocaleDateString()}</p>
        <p className={`font-bold w-full md:w-auto mb-2 md:mb-0 ${statusColors[order.status || 'PENDING']}`}>
          Статус: {statusDisplay[order.status || 'PENDING']}
        </p>
        <p className="font-heading text-xl text-text-light w-full md:w-auto">Итог: {formatMoneyInteger(order.total_price)}</p>
        <div className="flex items-center space-x-2 mt-4 md:mt-0 ml-auto">
          <Button variant="secondary" onClick={() => setShowDetails(!showDetails)} className="!py-1 !px-3 text-sm">
            {showDetails ? 'Скрыть детали' : 'Показать детали'}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-accent-gold/10 pt-4 mt-4"
          >
            <p className="text-text-light/80 mb-2">Адрес: {order.address}</p>
            {order.promo_code && (
              <p className="text-text-light/80 mb-2">Промокод: {order.promo_code} (Скидка: {Math.floor(parseFloat(order.discount_amount || '0'))} ₽)</p>
            )}
            <h4 className="font-heading text-lg text-text-light mb-2">Позиции заказа:</h4>
            <ul className="list-disc list-inside text-text-light/80 mb-4">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.product?.name} x {item.quantity} ({formatMoneyInteger(item.price_at_order)}/шт.)
                </li>
              ))}
            </ul>

            <h4 className="font-heading text-lg text-text-light mb-2">Изменить статус:</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {allOrderStatuses.map((statusItem) => (
                <Button
                  key={statusItem}
                  variant={order.status === statusItem ? 'primary' : 'secondary'}
                  onClick={() => handleStatusChange(statusItem)}
                  disabled={mutation.isPending || order.status === statusItem}
                  className="!py-1 !px-3 text-xs"
                >
                  {statusDisplay[statusItem]} {mutation.isPending && mutation.variables?.orderId === order.id && mutation.variables?.status === statusItem && <FaSpinner className="animate-spin ml-2 inline" />}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const DashboardOrdersTable: React.FC = () => {
  const { user } = useAuthStore();
  const [page, setPage] = useState(1);

  const { data, isLoading, error, isPlaceholderData, refetch } = useQuery<PaginatedManagerOrderList>({
    queryKey: ['managerOrders', page],
    queryFn: () => fetchManagerOrders(page),
    enabled: user?.role === 'MANAGER',
    placeholderData: (previousData) => previousData,
  });

  if (!user || user.role !== 'MANAGER') {
    return (
      <div className="text-center py-20 text-red-error font-body text-lg">
        У вас нет прав для доступа к панели управления.
      </div>
    );
  }

  if (isLoading && !data) {
    return (
      <div className="vintage-card-dark rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-main-dark/50">
            <tr>
              <th className="px-4 py-3 text-left font-heading text-text-light">ID</th>
              <th className="px-4 py-3 text-left font-heading text-text-light">Клиент</th>
              <th className="px-4 py-3 text-left font-heading text-text-light">Сумма</th>
              <th className="px-4 py-3 text-left font-heading text-text-light">Статус</th>
              <th className="px-4 py-3 text-left font-heading text-text-light">Действия</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRowSkeleton key={index} columns={5} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (error) return (
    <div className="text-center py-20 border border-red-error/50 bg-red-error/10 p-8 text-text-light rounded-lg">
      <p className="font-heading text-2xl text-red-error">Ошибка загрузки заказов</p>
      <p className="font-body text-text-light/70">{getErrorMessage(error)}</p>
      <Button variant="primary" onClick={() => refetch()} className="mt-4">
        <FaSync className="mr-2" /> Повторить
      </Button>
    </div>
  );

  const orders = data?.results || [];

  return (
    <div className="mt-8">
      {orders.length === 0 ? (
        <div className="text-center py-12 vintage-card-dark rounded-lg">
          <p className="font-body text-text-light/80">Активных заказов нет.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((order) => <OrderRow key={order.id} order={order} />)}
          </div>
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              onClick={() => setPage(old => Math.max(old - 1, 1))}
              disabled={page === 1 || isPlaceholderData}
              variant="secondary"
            >
              Предыдущая
            </Button>
            <span className="text-text-light font-body">Страница {page}</span>
            <Button
              onClick={() => {
                if (!isPlaceholderData && data?.next) {
                  setPage(old => old + 1);
                }
              }}
              disabled={!data?.next || isPlaceholderData}
              variant="secondary"
            >
              Следующая
            </Button>
          </div>
        </>
      )}
    </div>
  );
};