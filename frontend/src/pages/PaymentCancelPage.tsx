import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTimesCircle } from 'react-icons/fa';
import { Button } from '@/shared/ui/Button';
import { SectionDivider } from '@/shared/ui/SectionDivider/SectionDivider';

const PaymentCancelPage = () => {
    return (
        <div className="bg-main-dark bg-dark-engraving text-text-light min-h-screen pt-32 flex flex-col items-center justify-center">
            <SectionDivider variant="top" className="z-10" />
            <div className="page-container py-24 flex flex-col items-center justify-center text-center flex-grow">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                >
                    <FaTimesCircle className="text-8xl text-red-error mx-auto mb-6" />
                    <h1 className="font-display text-5xl mb-4 text-text-light">Оплата отменена</h1>
                    <p className="font-body text-lg text-text-light/80 max-w-lg mb-8">
                        Вы отменили процесс оплаты. Ваш заказ не был оформлен, но блюда остались в корзине.
                    </p>
                     <div className="flex justify-center gap-4">
                        <Link to="/cart"><Button variant="primary">Вернуться в корзину</Button></Link>
                        <Link to="/products"><Button variant="secondary">Продолжить покупки</Button></Link>
                    </div>
                </motion.div>
            </div>
            <SectionDivider variant="bottom" className="z-10" />
        </div>
    );
};

export default PaymentCancelPage;