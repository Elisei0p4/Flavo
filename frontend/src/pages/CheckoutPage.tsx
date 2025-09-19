import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartStore } from '@/entities/cart';
import { CheckoutForm } from '@/features/checkout';
import { SectionDivider } from '@/shared/ui/SectionDivider/SectionDivider';
import { SectionHeader } from '@/shared/ui/SectionHeader/SectionHeader';

const CheckoutPage = () => {
    const items = useCartStore((state) => state.items);

    if (items.length === 0) {
        return <Navigate to="/cart" replace />;
    }

    return (
        <motion.div
            className="bg-main-dark bg-dark-engraving text-text-light min-h-screen pt-32 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <SectionDivider variant="top" className="z-10" />
            <div className="page-container py-16 flex-grow">
                <SectionHeader title="Оформление заказа" className="!text-text-light" />
                <div className="max-w-lg mx-auto">
                    <CheckoutForm />
                </div>
            </div>
            <SectionDivider variant="bottom" className="z-10" />
        </motion.div>
    );
};

export default CheckoutPage;