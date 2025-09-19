import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { useCartStore } from '@/entities/cart';
import { motion } from 'framer-motion';

interface RemoveFromCartButtonProps {
  productId: number;
}

export const RemoveFromCartButton: React.FC<RemoveFromCartButtonProps> = ({ productId }) => {
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <motion.button 
      whileHover={{ scale: 1.1 }} 
      whileTap={{ scale: 0.9 }} 
      onClick={() => removeItem(productId)} 
      className="text-red-error hover:text-red-error/80 p-2 transition-colors"
      aria-label="Удалить из корзины"
    >
      <FaTrash />
    </motion.button>
  );
};