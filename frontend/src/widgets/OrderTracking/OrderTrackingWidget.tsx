import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaBox, FaRegClock, FaCheckCircle, FaTruck, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

import type { OrderStatus } from '@/entities/order';

interface OrderTrackingWidgetProps {
    orderId: string;
}

const statusSteps: OrderStatus[] = ['PENDING', 'PREPARING', 'DELIVERING', 'COMPLETED'];

const statusInfo: Record<OrderStatus, { icon: React.ReactElement, text: string, description: string, color: string }> = {
    PENDING: { icon: <FaRegClock />, text: 'Оплачен, в ожидании', description: 'Ваш заказ оплачен и ожидает обработки.', color: 'text-yellow-400' },
    PREPARING: { icon: <FaBox />, text: 'Готовится', description: 'Наши шеф-повара готовят ваши блюда с любовью.', color: 'text-blue-400' },
    DELIVERING: { icon: <FaTruck />, text: 'Доставляется', description: 'Курьер уже в пути! Ожидайте доставку в ближайшее время.', color: 'text-purple-400' },
    COMPLETED: { icon: <FaCheckCircle />, text: 'Доставлен', description: 'Наслаждайтесь изысканными вкусами!', color: 'text-green-400' },
    CANCELLED: { icon: <FaTimesCircle />, text: 'Отменен', description: 'К сожалению, ваш заказ был отменен.', color: 'text-red-400' },
};

export const OrderTrackingWidget: React.FC<OrderTrackingWidgetProps> = ({ orderId }) => {
    const [currentStatus, setCurrentStatus] = useState<OrderStatus>('PENDING');
    const [message, setMessage] = useState('Подключение к серверу отслеживания...');
    const wsRef = useRef<WebSocket | null>(null);

    const authStorage = localStorage.getItem('auth-storage');
    const accessToken = authStorage ? JSON.parse(authStorage).state.accessToken : null;

    useEffect(() => {
        if (!accessToken) {
            setMessage('Для отслеживания заказа необходимо войти в систему.');
            return;
        }
        
        const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        const wsUrl = `${wsProtocol}${window.location.host}/ws/track_order/${orderId}/?token=${accessToken}`;
        
        wsRef.current = new WebSocket(wsUrl);

        wsRef.current.onopen = () => {
            setMessage('Соединение установлено. Ожидание обновлений статуса...');
            toast.success('Начато отслеживание заказа!', { duration: 2000 });
        };

        wsRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const newStatus: OrderStatus = data.status as OrderStatus;
            setCurrentStatus(newStatus);
            setMessage(data.message);
            toast(`Статус заказа: ${statusInfo[newStatus].text}`, { duration: 3000 });
        };

        wsRef.current.onclose = (event) => {
            if (!event.wasClean) {
                setMessage('Соединение с сервером отслеживания прервано.');
                toast.error('Проблема с соединением отслеживания заказа.');
            }
        };

        wsRef.current.onerror = () => {
            setMessage('Ошибка соединения с сервером отслеживания.');
            toast.error('Ошибка при отслеживании заказа.');
        };

        return () => wsRef.current?.close();
    }, [orderId, accessToken]);

    const activeStepIndex = statusSteps.indexOf(currentStatus);
    const isCancelled = currentStatus === 'CANCELLED';

    const renderProgressLine = (index: number) => {
        const isCompleted = index < activeStepIndex;
        return (
            <div className="flex-grow h-1 bg-main-dark/50 mx-2 relative overflow-hidden rounded-full">
                <motion.div
                    className="absolute top-0 left-0 h-full bg-accent-gold"
                    initial={{ width: 0 }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
            </div>
        );
    };

    return (
        <div className="vintage-card-dark p-6 flex flex-col items-center justify-center min-h-[400px] text-text-light rounded-lg">
            <h3 className="font-heading text-3xl mb-6">Статус Вашего заказа</h3>
            
            <div className="flex items-center w-full max-w-4xl my-8">
                {statusSteps.map((status, index) => (
                    <React.Fragment key={status}>
                        <motion.div
                            className={`relative flex flex-col items-center transition-colors duration-500`}
                        >
                           <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors duration-500 ${index <= activeStepIndex && !isCancelled ? 'border-accent-gold bg-accent-gold/20' : 'border-text-light/20'}`}>
                               <div className={`text-2xl transition-colors duration-500 ${index <= activeStepIndex && !isCancelled ? statusInfo[status].color : 'text-text-light/50'}`}>
                                   {statusInfo[status].icon}
                               </div>
                           </div>
                            <span className="absolute -bottom-8 text-xs font-body whitespace-nowrap text-text-light/80">
                                {statusInfo[status].text}
                            </span>
                        </motion.div>
                        {index < statusSteps.length - 1 && renderProgressLine(index)}
                    </React.Fragment>
                ))}
            </div>

            {isCancelled && (
                 <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mt-12 flex items-center gap-4 p-4 border border-red-error/50 bg-red-error/10 rounded-lg"
                 >
                    <div className="text-3xl text-red-error">{statusInfo.CANCELLED.icon}</div>
                    <div>
                        <p className="font-heading text-2xl text-red-error">{statusInfo.CANCELLED.text}</p>
                        <p className="font-body text-text-light/80">{statusInfo.CANCELLED.description}</p>
                    </div>
                 </motion.div>
            )}

            {!isCancelled && (
                <motion.div
                    key={currentStatus}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mt-12"
                >
                    <p className={`font-heading text-2xl ${statusInfo[currentStatus].color} mb-2`}>
                        {statusInfo[currentStatus].text}
                    </p>
                    <p className="font-body text-lg text-text-light/80">
                        {message}
                    </p>
                </motion.div>
            )}
        </div>
    );
};