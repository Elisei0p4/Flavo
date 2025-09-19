import { SectionHeader } from '@/shared/ui/SectionHeader/SectionHeader';
import { SectionDivider } from '@/shared/ui/SectionDivider/SectionDivider';
import { DashboardOrdersTable } from '@/widgets';
import { motion } from 'framer-motion'; 

const DashboardPage = () => {
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
                <SectionHeader title="Панель управления заказами" className="!text-text-light" />
                <DashboardOrdersTable />
            </div>
            <SectionDivider variant="bottom" className="z-10" />
        </motion.div>
    );
};

export default DashboardPage;