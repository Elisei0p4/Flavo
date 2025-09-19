import React from 'react';
import { Collections } from '@/widgets/Collections/Collections';
import { SectionDivider } from '@/shared/ui/SectionDivider/SectionDivider';
import { motion } from 'framer-motion';

const CollectionsPage: React.FC = () => {
  return (
    <motion.div 
        className="bg-main-light bg-light-engraving text-text-dark min-h-screen pt-32 flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
    > 
      <SectionDivider variant="top" className="z-10" />
      <div className="page-container py-16 flex-grow">
        <Collections />
      </div>
      <SectionDivider variant="bottom" className="z-10" />
    </motion.div>
  );
};

export default CollectionsPage;