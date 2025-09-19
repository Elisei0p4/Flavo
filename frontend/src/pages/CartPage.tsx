import { Cart } from '@/widgets/Cart/Cart';
import { SectionDivider } from '@/shared/ui/SectionDivider/SectionDivider';
import { motion } from 'framer-motion';

const CartPage = () => {
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
                <Cart />
            </div>
            <SectionDivider variant="bottom" className="z-10" />
        </motion.div>
    );
};

export default CartPage;