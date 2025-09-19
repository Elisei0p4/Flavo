import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBox, FaRegClock, FaCheckCircle, FaTruck, FaTimesCircle } from 'react-icons/fa';
import { useOrders } from '@/entities/order';
import { OrderCardSkeleton } from '@/entities/order/ui';
import { Button } from '@/shared/ui/Button'; 
import { formatMoneyInteger } from '@/shared/lib/money';
import type { OrderStatus, Order } from '@/entities/order';
import { getErrorMessage } from '@/shared/lib/errorHandler';

const statusMap: Record<OrderStatus, { icon: React.ReactElement, text: string, color: string, bgColor: string }> = {
    PENDING: { icon: <FaRegClock />, text: 'Оплачен', color: 'text-yellow-300', bgColor: 'bg-yellow-500/10' },
    PREPARING: { icon: <FaBox />, text: 'Готовится', color: 'text-blue-300', bgColor: 'bg-blue-500/10' },
    DELIVERING: { icon: <FaTruck />, text: 'Доставляется', color: 'text-purple-300', bgColor: 'bg-purple-500/10' },
    COMPLETED: { icon: <FaCheckCircle />, text: 'Доставлен', color: 'text-green-300', bgColor: 'bg-green-500/10' },
    CANCELLED: { icon: <FaTimesCircle />, text: 'Отменен', color: 'text-red-400', bgColor: 'bg-red-500/10' },
};

const OrderItem: React.FC<{ order: Order }> = ({ order }) => {
    const currentStatus = order.status || 'PENDING';
    const { icon, text, color, bgColor } = statusMap[currentStatus];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2, x: 2 }}
            className="vintage-card-dark p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center transition-all hover:border-accent-gold rounded-lg"
        >
            <div className="mb-2 sm:mb-0">
                <p className="font-heading text-lg text-text-light">Заказ #{order.id.substring(0, 8)}</p>
                <p className="font-body text-sm text-text-light/80">{new Date(order.created_at).toLocaleString()}</p>
                <div className={`inline-flex items-center gap-2 mt-2 text-sm font-sans font-bold px-2 py-1 rounded-full ${color} ${bgColor}`}>
                  {icon}<span>{text}</span>
                </div>
            </div>
            <div className="text-left sm:text-right">
                <p className="text-text-light font-heading text-xl">{formatMoneyInteger(order.total_price)}</p>
                <Link to={`/orders/${order.id}`}>
                    <Button variant="secondary" className="!py-1 !px-3 mt-2">Детали</Button>
                </Link>
            </div>
        </motion.div>
    );
};

export const OrderList: React.FC = () => {
    const { data: orders, isLoading, error } = useOrders();

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <h2 className="font-display text-5xl mb-6 text-text-light">Мои заказы</h2>
            <div className="space-y-4">
                {isLoading && (
                    <>
                        <OrderCardSkeleton />
                        <OrderCardSkeleton />
                        <OrderCardSkeleton />
                    </>
                )}
                {error && (
                  <div className="text-center py-12 vintage-card-dark rounded-lg">
                    <p className="font-heading text-2xl text-red-error">Ошибка загрузки заказов</p>
                    <p className="font-body text-text-light/70">{getErrorMessage(error)}</p>
                  </div>
                )}
                {orders && orders.length > 0 ? (
                    orders.map(order => <OrderItem key={order.id} order={order} />)
                ) : !isLoading && !error && (
                    <div className="text-center py-12 vintage-card-dark rounded-lg">
                        <p className="font-body text-text-light/80">У вас еще нет заказов.</p>
                        <Link to="/products">
                            <Button variant="primary" className="mt-4">К продуктам</Button>
                        </Link>
                    </div>
                )}
            </div>
        </motion.div>
    );
};