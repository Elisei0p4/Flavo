import { ProfileCard } from '@/widgets/ProfileCard/ProfileCard';
import { OrderList } from '@/widgets/OrderList/OrderList';
import { SectionDivider } from '@/shared/ui/SectionDivider/SectionDivider';
import { motion } from 'framer-motion';

const ProfilePage = () => {
    return (
        <motion.div 
            className="bg-main-dark bg-dark-engraving text-text-light min-h-screen pt-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <SectionDivider variant="top" className="z-10" />
            <div className="page-container py-16">
                <div className="grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-1">
                        <ProfileCard />
                    </div>
                    <div className="lg:col-span-2">
                        <OrderList />
                    </div>
                </div>
            </div>
            <SectionDivider variant="bottom" className="z-10" />
        </motion.div>
    );
};

export default ProfilePage;