import React from 'react';
import { motion } from 'framer-motion';

export const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-20">
      <motion.div
        className="rounded-full h-16 w-16 border-4 border-t-4 border-b-4 border-accent-gold animate-spin"
        role="status"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="sr-only">Загрузка...</span>
      </motion.div>
    </div>
  );
};