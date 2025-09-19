import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import { useCartStore } from '@/entities/cart';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/shared/ui/Button';
import { SectionDivider } from '@/shared/ui/SectionDivider/SectionDivider';

const PaymentSuccessPage = () => {
    const clearCart = useCartStore((state) => state.clearCart);
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (sessionId) {
            clearCart();
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['user'] });
        }
    }, [sessionId, clearCart, queryClient]);

    return (
        <div className="bg-main-dark bg-dark-engraving text-text-light min-h-screen pt-32 flex flex-col items-center justify-center">
            <SectionDivider variant="top" className="z-10" />
            <div className="page-container py-24 flex flex-col items-center justify-center text-center flex-grow">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                >
                    <FaCheckCircle className="text-8xl text-green-400 mx-auto mb-6" />
                    <h1 className="font-display text-5xl mb-4 text-text-light">Оплата прошла успешно!</h1>
                    <p className="font-body text-lg text-text-light/80 max-w-lg mb-8">
                        Ваш заказ принят в обработку. Вы можете отслеживать его статус
                        в своем личном кабинете.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/profile"><Button variant='primary'>Перейти в профиль</Button></Link>
                        <Link to="/products"><Button variant="secondary">Продолжить покупки</Button></Link>
                    </div>
                </motion.div>
            </div>
            <SectionDivider variant="bottom" className="z-10" />
        </div>
    );
};

export default PaymentSuccessPage;