import { useParams } from 'react-router-dom';
import { SectionHeader } from '@/shared/ui/SectionHeader/SectionHeader';
import { SectionDivider } from '@/shared/ui/SectionDivider/SectionDivider';
import { OrderTrackingWidget } from '@/widgets';
import { motion } from 'framer-motion'; 

const OrderTrackingPage = () => {
    const { orderId } = useParams<{ orderId: string }>();
    
    const displayOrderId = orderId ? orderId.substring(0, 8) : 'N/A';

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
                <SectionHeader title={`Отслеживание заказа #${displayOrderId}...`} className="!text-text-light" />
                {orderId ? (
                    <OrderTrackingWidget orderId={orderId} /> 
                ) : (
                    <p className="font-body text-text-light/80 text-center mt-8">Идентификатор заказа не найден.</p>
                )}
            </div>
            <SectionDivider variant="bottom" className="z-10" />
        </motion.div>
    );
};

export default OrderTrackingPage;